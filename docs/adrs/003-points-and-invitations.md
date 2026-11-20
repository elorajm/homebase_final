# ADR 003: Automatic task points and invitation codes

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** HomeBase team
- **Related:** [ADR 001: SvelteKit](001-sveltekit.md), [ADR 002: Supabase](002-supabase.md), [Database design](../database.md), [API design](../api.md), [System architecture](../system.md)

## Context

HomeBase has two features that need explicit rules because they affect fairness and security:

1. **Points.** Members earn points for completing tasks. The points must be awarded automatically, only once per occurrence, reversed when a completion is reopened, and totaled for a leaderboard. Shared households are trusting environments, but the rules still need to prevent accidental duplication and casual manipulation.
2. **Invitations.** New members join with a code. The code must be hard to guess, expire, be revocable, and never be stored in plain text. Joining must not grant more access than intended.

This record covers both decisions, the abuse they must prevent, and the trade-offs the team accepted.

## Decision

### Part A: Automatic task points

1. **Automatic awards.** Completing an occurrence creates the award in the same transaction as the completion. Members do not have a separate "claim points" step.
2. **Occurrence identity.** An occurrence is `(task_id, occurrence_date)`. At most one active completion may exist per occurrence, enforced by a partial unique index. Recurring occurrences are tracked independently.
3. **Ledger.** Points are recorded in an append-only table, `point_transactions`. The leaderboard sums that table. No stored total is updated directly.
4. **Reversal.** Reopening an occurrence writes one `reversal` row that references the award. A unique index allows at most one reversal per award.
5. **Snapshot.** The award amount is copied from the task's `points_value` when the completion happens. Later changes to the task do not change past awards or their reversals.
6. **Recipient.** Points go to the task's assignee, even when an admin records the completion.
7. **Who may complete.** Only the assignee or an admin may complete or reopen a task occurrence.
8. **Admin-only fields.** Only admins may change `pointsValue`, `assigneeId`, and `recurrence`.
9. **Completion eligibility.** An occurrence may be completed only if it is scheduled for the task and is no later than today, in the household's time zone. There is no lower date limit: overdue occurrences remain eligible for completion and automatic points. Reopening is always allowed for an active completion.
10. **No award when there is nothing to award.** Unassigned tasks and tasks worth zero points can be completed, but no award row is written.

### Part B: Invitation codes

1. **Admin-only creation.** Only admins can create or revoke invitations.
2. **Strong codes.** The server generates each code with a cryptographic random source. A code has 80 bits of entropy: 16 characters from a 32-character alphabet, shown in four groups of four characters.
3. **Keyed hashing.** The server stores `HMAC-SHA-256(INVITATION_HMAC_SECRET, normalized code)`. The secret is server-only. The plaintext code is shown to the admin once and is never stored.
4. **Limits.** Expiry defaults to 7 days and may be set from 1 to 30 days. Maximum uses default to 1 and may be set from 1 to 20.
5. **Revocation.** An admin can revoke an invitation at any time. A revoked code cannot be redeemed.
6. **Safe redemption.** Redemption runs in a database function that locks the invitation row. It checks revocation, expiry, and use count, and adds the membership in the same transaction.
7. **Member role only.** Redeeming an invitation always grants the `member` role. Admins are promoted afterward by an existing admin.
8. **Generic failure.** Unknown, revoked, expired, and used-up codes all return `404 INVITATION_INVALID`.
9. **Rate limits.** Redemption attempts are limited per user and per IP address (see [api.md, section 6.2](../api.md#62-proposed-rate-limits)).

## Rationale

### Why automatic points

Requiring members to confirm their own points would add steps without adding protection, because the member who completes a task is the one who benefits from the award. Automatic awards tied to the completion transaction are simpler to explain, and the database can guarantee they match completions exactly. The leaderboard is then a view of recorded history rather than a number someone maintains.

Assigning the points to the assignee, not the completer, prevents an admin's convenience action from changing who earns points. If an admin completes a task on a member's behalf, the member still receives the points.

### Why occurrence-level identity

Tracking points per task would award a recurring task once and then block it. Tracking per occurrence means each scheduled date stands alone, so a missed week does not affect the next one. The occurrence key also gives the database a natural constraint to enforce.

### Why a ledger and reversals

A ledger records what happened, so a disputed total can be explained row by row. Reversals rather than deletions keep that history. A reopened completion still appears in the history, and the points net to zero.

### Why invitation codes

Invitation codes are simple to share, and they work over any channel, such as a message or a verbal invitation. Email-bound invitations are stronger, but they need email delivery, more interface, and an account for the invitee before they can join. Codes meet the course requirements with a smaller surface. The rules above keep the risk acceptable for a household application.

## Abuse prevention

| Threat                                                                                | Control                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A member raises their own points by editing a task's value.                           | Only admins may change `pointsValue`. The database also limits it to 0 to 100.                                                                                                                                      |
| A member completes tasks assigned to others to collect points.                        | Only the assignee or an admin may complete a task.                                                                                                                                                                  |
| A member assigns a task to themself to collect points.                                | Only admins may change `assigneeId`.                                                                                                                                                                                |
| A member completes future occurrences in advance to collect a week of points at once. | Completion is allowed only for occurrences no later than today.                                                                                                                                                     |
| A member backfills many overdue occurrences at once to collect a larger total.        | Each scheduled occurrence awards points once, and only the assignee or an admin can complete it. No lower date limit is applied, because overdue work must stay eligible. This is an accepted risk; see Trade-offs. |
| The same occurrence is completed twice, by accident or through a retry.               | The partial unique index allows one active completion per occurrence. The second request returns `409 ALREADY_COMPLETED`.                                                                                           |
| An award is written twice under concurrent requests.                                  | The completion row locks the task with `FOR SHARE`. The unique index on awards allows one award per completion.                                                                                                     |
| A reversal is written twice when a reopen request is retried.                         | A unique index allows one reversal per award, and reopening locks the completion row.                                                                                                                               |
| A member repeatedly completes and reopens to generate traffic.                        | Each occurrence still has at most one active award, so the net effect is unchanged. Rate limits apply to completion and reopen routes.                                                                              |
| Someone guesses an invitation code.                                                   | 80 bits of entropy, rate limits per user and per IP, and generic errors that do not reveal which part failed.                                                                                                       |
| An invitation remains usable after an admin meant to end it.                          | Revocation takes effect immediately. The default expiry is 7 days.                                                                                                                                                  |
| Invitation codes are recovered from a copy of the database.                           | Only HMAC hashes are stored. Recovering a code also requires the server secret.                                                                                                                                     |
| An invitation grants administrator access.                                            | Redemption always grants the `member` role.                                                                                                                                                                         |
| An outsider learns household names or membership by trying codes.                     | Invitation errors reveal nothing about the household. Household routes return `404` to non-members.                                                                                                                 |
| A household is left without an administrator and cannot be managed.                   | A trigger prevents removing or demoting the last admin. Routes return `409 LAST_ADMIN_REQUIRED`.                                                                                                                    |

## Membership security

- **Membership is the access rule.** Every household query and policy checks the `household_members` table on each request. A removed member loses access on their next request, because nothing is cached in the session. Realtime events stop for them as well, because RLS is evaluated for each event. This second point must be verified during implementation.
- **Membership changes are limited.** Only admins may change roles or remove others. A member may leave. The last admin cannot leave or be demoted.
- **Assignments are cleared, points are kept.** When a member leaves, tasks they were assigned to become unassigned. Their point history stays in the ledger, and it reappears if they rejoin.
- **Composite keys prevent cross-household links.** A task can only be assigned to a member of the same household, and a grocery item can only belong to a list in the same household. The database enforces this.
- **Invitations cannot be used to escalate.** Redemption is the only way to join by code, and it always grants `member`.

## Trade-offs

| Decision                                      | Benefit                                                                        | Cost                                                                                                                                                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automatic awards on completion                | No extra steps. Points always match completions.                               | No review by a second person. Points depend on members being honest, which is acceptable for a household.                                                                                          |
| Only assignees and admins may complete        | Members cannot collect points for other people's chores.                       | If a member forgets, an admin must complete the task for them.                                                                                                                                     |
| Only admins may create and edit tasks         | Members cannot inflate points or assign work to themselves.                    | Members cannot add their own chores. Allowing capped member-created tasks is a possible future change.                                                                                             |
| No lower date limit on completion             | Overdue work stays eligible, so late completions are recorded and earn points. | A member can backfill several past occurrences at once, and each one awards points. This is accepted for a trusted household. A cap or an admin review can be added later if it becomes a problem. |
| Points attached to users, not memberships     | Points survive leaving and rejoining.                                          | The leaderboard needs an extra filter so it shows only current members.                                                                                                                            |
| Invitation codes instead of email invitations | Simple to share. No email delivery needed.                                     | Anyone with the code can join until it expires, is used up, or is revoked. Expiry and max uses limit exposure.                                                                                     |
| Codes shown once                              | A stolen database does not reveal usable codes.                                | An admin who loses a code must revoke it and create a new one.                                                                                                                                     |
| Generic invitation errors                     | Attackers learn nothing about which codes exist.                               | Users cannot tell that a code expired, so the interface must say "this code is no longer active" and suggest asking for a new one.                                                                 |
| Secret-based hashing                          | Codes cannot be checked without the server secret.                             | Rotating the secret invalidates all outstanding invitations.                                                                                                                                       |

## Open questions

- **Backfill limits.** Should backfilling of overdue occurrences be capped, or should admins review completion history? No cap exists today.
- **Member-created tasks.** Should members be allowed to create tasks with capped point values? This would widen the chore list but adds validation rules.
- **Leaderboard periods.** The API supports optional date ranges. The team still needs to decide which periods the interface offers, such as this week or this month.

## Consequences

- Points, completions, and reversals depend on database functions. Those functions must be tested directly, not only through the API.
- The rate limits are proposals. They are recorded here so they can be changed deliberately, not by accident.
- The invitation flow is simple for users, but it relies on the secrecy of codes. Users should be told not to post them publicly.
- The security of points and membership depends on RLS and the database functions. The tests listed in [database.md, section 12](../database.md#12-migrations-and-verification-planned) are required before these features are considered complete.
