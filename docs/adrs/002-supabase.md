# ADR 002: Use Supabase PostgreSQL and Supabase Auth

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** HomeBase team
- **Related:** [ADR 001: SvelteKit](001-sveltekit.md), [ADR 003: Points and invitations](003-points-and-invitations.md), [Database design](../database.md), [System architecture](../system.md)

## Context

HomeBase stores data that is strongly relational and must be protected per household:

- Households, memberships with roles, and invitations.
- Tasks, recurring occurrences, completions, and a points ledger that must never award the same occurrence twice.
- Shared lists, calendar events, and expenses, all scoped to one household.

The system also needs user accounts with email and password, sessions, password reset, live updates, and hosting that fits a free-tier course project. Authorization must hold even when an API route has a bug, so the data layer itself needs to enforce household isolation.

## Decision

Use **Supabase** for three things:

1. **PostgreSQL** as the database, with schema changes in SQL migrations.
2. **Supabase Auth** for account creation, login, sessions, and password flows.
3. **Row Level Security (RLS)** for household isolation, with server-side role checks in SvelteKit as a second layer.

Supabase Realtime is used for live updates. It is covered in [system.md](../system.md#44-real-time-updates).

## Options considered

| Criterion                                  | Supabase (chosen)                                                                       | MongoDB Atlas with a custom Node.js backend                                                                                            | Custom PostgreSQL with Express                                 |
| ------------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Data model for memberships and the ledger  | Relational. Foreign keys, `CHECK`, and partial unique indexes match the rules directly. | Document model. Relationships and uniqueness are maintained by application code or by additional collections and indexes.              | Relational, as with Supabase.                                  |
| Atomic multi-step writes                   | Single transaction per database function call.                                          | Multi-document transactions are supported on Atlas. Constraints must still be enforced in application code or with additional indexes. | Single transaction per function or statement.                  |
| Authorization in the data layer            | RLS policies on every table.                                                            | No built-in equivalent. Every query path needs its own checks in the application.                                                      | Must be built with database roles, or left to the application. |
| Authentication                             | Built in: sessions, email confirmation, password reset.                                 | Not included. A custom auth layer or a third-party service is needed.                                                                  | Not included. Custom auth or a third-party service is needed.  |
| Real-time updates                          | Postgres changes streamed to clients, filtered and checked by RLS.                      | Change streams exist, but the project would need to build its own delivery and access checks.                                          | Must be built.                                                 |
| Components to host and secure              | Database, auth, and realtime in one managed service.                                    | Database and a separately hosted backend.                                                                                              | Database, backend, and auth, all custom.                       |
| Free-tier suitability for a course project | Usable. Limits apply (see below).                                                       | Usable. Limits apply.                                                                                                                  | Usable, but more setup time.                                   |
| Vendor coupling                            | Higher. Auth and realtime are Supabase-specific.                                        | Moderate. Atlas is hosted MongoDB.                                                                                                     | Lowest. Standard Postgres and a framework of choice.           |

## Rationale

1. **The rules are relational.** A duplicate award is prevented by a partial unique index on `task_completions (task_id, occurrence_date) WHERE reopened_at IS NULL`. A household member cannot be added twice because `(household_id, user_id)` is the primary key. The database enforces these rules for every client, including ones written in the future.
2. **Authorization lives with the data.** RLS policies apply to every query, including queries made by a route handler that forgot a check. Household isolation does not depend on each handler being correct.
3. **Less security code to write.** Password hashing, session tokens, email confirmation, and password reset are handled by a maintained service. The team's custom security code is limited to business rules and permissions, which are the parts the course requires them to design.
4. **The ledger fits transactions.** Point awards, reversals, and completions run as PL/pgSQL functions in one transaction, as described in [database.md, section 7](../database.md#7-atomic-point-transactions).
5. **Less infrastructure.** One managed service provides the database, authentication, and real-time delivery. The team does not operate a separate backend server for these features.
6. **Standard SQL.** Schema, policies, and functions are plain PostgreSQL. A data export can be restored into any PostgreSQL server. This keeps the lock-in limited to the authentication and realtime integration.

Why not MongoDB Atlas with Node.js: MongoDB is a good database, and Atlas supports multi-document transactions. The deciding factor is that HomeBase's main requirements are constraints and per-row authorization. Those would be implemented in application code with MongoDB, where PostgreSQL enforces them in the schema. The team would also need to build authentication and real-time delivery.

Why not custom PostgreSQL with Express: the database choice would be the same, but the project would also own session handling, password storage, email flows, and real-time delivery. Those are areas where mistakes are common and hard to see. Supabase reduces that work so more time can go into the household features.

## Consequences

**Positive**

- Household isolation is enforced by the database for every query path.
- Constraints and functions document the business rules, and they are reviewable as SQL in pull requests.
- Authentication and session management do not need custom code.
- Local development can run the same stack with the Supabase CLI.

**Negative or accepted**

- The team must learn RLS and PL/pgSQL. A wrong policy often fails silently, returning no rows or too many rows, so the policies need tests.
- The application depends on Supabase's SDK and Auth service. Moving away would mean replacing the authentication layer and the realtime integration.
- The service-role key bypasses RLS, so its exposure would be serious.

## Free-tier considerations

- Most development should use the local Supabase stack, which runs in Docker. Only a shared development project and a production project are hosted.
- The free tier has limits on storage, bandwidth, monthly active users, and realtime connections. Current values are on the Supabase pricing page, and they change, so this record does not quote them. Check them before any demonstration.
- A free project may be paused after a period of inactivity. Log in to the dashboard and confirm the project is running before a presentation.
- Backups on the free tier may be limited. The team should keep migrations and seed data in the repository, which allows the schema to be rebuilt, and export the development data with `pg_dump` before major changes.
- HomeBase's data volume is small (households with a handful of members). The free tier should be sufficient, but the team should check this assumption with real usage.
- MongoDB Atlas's free cluster also has storage limits, so the free tier does not favor one option over the other on this criterion.

## Risks and mitigations

| Risk                                                                           | Mitigation                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| An RLS policy is wrong and exposes one household's data to another.            | Default-deny: RLS is enabled on every table, and no table is exposed without a policy. Database tests check cross-household access ([database.md, section 12](../database.md#12-migrations-and-verification-planned)). Every policy change is reviewed in a pull request. |
| The service-role key is exposed to the browser or committed to the repository. | The key is used only in server code, never prefixed `PUBLIC_`, stored as a sensitive variable in Vercel, and excluded from logs and documentation. If exposure is suspected, rotate it in the Supabase dashboard immediately.                                             |
| A `SECURITY DEFINER` function is abused to bypass RLS.                         | Each function sets `search_path = ''`, qualifies every name, checks `auth.uid()` and membership itself, and is executable only by `authenticated`. Each function is reviewed.                                                                                             |
| Vendor lock-in makes migration expensive.                                      | Use standard PostgreSQL features. Keep business rules in SQL functions, which are portable. Keep the Supabase client in one server module. Keep migrations in the repository.                                                                                             |
| Free-tier limits or project pausing interrupt development or a demonstration.  | Develop against the local stack. Check the project status before demonstrations. Keep a documented restore procedure.                                                                                                                                                     |
| Real-time events reach users who should not see them.                          | Realtime uses RLS checks on each event. Include a test where a second user does not receive another household's events.                                                                                                                                                   |
| Auth email delivery is rate limited during testing.                            | Use a small set of test accounts, and limit repeated sign-up attempts during development.                                                                                                                                                                                 |
| Schema drift between local, development, and production databases.             | Changes are made only through migrations. CI applies migrations to a clean database before the tests run.                                                                                                                                                                 |

## Review

Revisit this decision if Supabase's free tier cannot support the team's demonstration needs, or if a requirement such as offline use or a non-Supabase identity provider becomes necessary.
