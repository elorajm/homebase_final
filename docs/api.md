# HomeBase API Design

> **Status: planned.** None of these routes exist yet. This document specifies the paths, methods, payloads, and status codes to implement. A route should be described as implemented only after its handler and tests exist.

## 1. Conventions

| Topic               | Convention                                                                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base path           | `/api`. Routes are SvelteKit endpoints in `src/routes/api/`, written as `+server.ts` files.                                                                                                                            |
| Path parameters     | Written as `{householdId}` in this document. The folder for that route is `[householdId]`. Diagrams use `:householdId`.                                                                                                |
| `{base}`            | Shorthand for `/api/households/{householdId}`, used in the tables below.                                                                                                                                               |
| Content type        | Request and response bodies are JSON (`application/json; charset=utf-8`). Requests with a body must send `Content-Type: application/json`.                                                                             |
| Field names         | `camelCase` in JSON. The database uses `snake_case`. The server maps between the two. Names in this document are the JSON names.                                                                                       |
| Identifiers         | UUID strings.                                                                                                                                                                                                          |
| Dates               | `YYYY-MM-DD` for calendar dates in the household's time zone (due dates, occurrences, expense dates).                                                                                                                  |
| Timestamps          | ISO 8601 in UTC with a `Z` suffix, for example `2026-11-16T18:42:10Z`.                                                                                                                                                 |
| Money               | Integer cents in a field named `amountCents`. The household currency is in `currencyCode`.                                                                                                                             |
| Authentication      | Every route requires a Supabase session, carried in cookies set by the Supabase SSR helper. Bearer-token authentication is not planned for version 1.                                                                  |
| Authorization       | Each route states who may call it (section 4). The handler checks the household role, and RLS checks it again in the database.                                                                                         |
| Non-members         | A user who is not a member of a household receives `404 NOT_FOUND` for every route under `{base}`. The response does not reveal whether the household exists.                                                          |
| Success bodies      | A single resource is returned as the object itself. A collection is returned as `{ "items": [ ... ] }`.                                                                                                                |
| Pagination          | Date-range endpoints require `from` and `to` (inclusive, `YYYY-MM-DD`). The range may not exceed 93 days. Other list endpoints accept `limit` (default 100, maximum 200). Cursor pagination is planned only if needed. |
| Retries             | Completing an occurrence is safe to retry. A repeated request returns `409 ALREADY_COMPLETED` with the existing completion, which the client can treat as success.                                                     |
| Rate limits         | Proposed limits are listed in section 6. Exceeding them returns `429 RATE_LIMITED` with a `Retry-After` header in seconds.                                                                                             |
| Cross-site requests | SvelteKit's origin checks apply to form-style requests. API routes require `application/json`, which triggers a CORS preflight for cross-origin calls. Session cookies use `SameSite=Lax`.                             |

## 2. Roles

The roles and the permission rules are defined in [system.md, section 6](system.md#6-role-permissions). The routes in this document use these labels:

| Label             | Meaning                                                                             |
| ----------------- | ----------------------------------------------------------------------------------- |
| Signed-in user    | Any user with a valid session. Does not need household membership.                  |
| Member            | Active member of the household, with either role.                                   |
| Admin             | Member with the `admin` role.                                                       |
| Creator or admin  | The user who created the row, or any admin in the household.                        |
| Assignee or admin | For task completions: the user assigned to the task, or any admin in the household. |

## 3. Error format

Every error response uses the same envelope:

```json
{
	"error": {
		"code": "VALIDATION_FAILED",
		"message": "The request contains invalid fields.",
		"details": [{ "field": "pointsValue", "message": "Must be an integer from 0 to 100." }]
	}
}
```

- `code` is a stable, machine-readable value. Clients branch on `code`, never on `message`.
- `message` is a short English sentence suitable for display. The UI may translate it later.
- `details` is optional. For validation errors it lists one entry per invalid field. For conflicts it may include the ID of the existing resource.

### 3.1 Error codes

| Code                   | HTTP | Meaning                                                                                                |
| ---------------------- | ---- | ------------------------------------------------------------------------------------------------------ |
| `UNAUTHENTICATED`      | 401  | No valid session.                                                                                      |
| `FORBIDDEN`            | 403  | The caller is a member but lacks the role for this action.                                             |
| `NOT_FOUND`            | 404  | The resource does not exist, or the caller cannot see it (including non-members).                      |
| `INVITATION_INVALID`   | 404  | The invitation code is unknown, revoked, expired, or used up. One code covers all of these on purpose. |
| `VALIDATION_FAILED`    | 400  | The body or query is malformed. `details` lists the fields.                                            |
| `INVALID_OCCURRENCE`   | 422  | The date is not a scheduled occurrence of this task.                                                   |
| `OCCURRENCE_IN_FUTURE` | 422  | The occurrence is scheduled after today, in the household's time zone.                                 |
| `ALREADY_COMPLETED`    | 409  | The occurrence already has an active completion.                                                       |
| `NOT_COMPLETED`        | 409  | There is no active completion to reopen.                                                               |
| `ALREADY_MEMBER`       | 409  | The caller is already a member of the household.                                                       |
| `LAST_ADMIN_REQUIRED`  | 409  | The change would leave the household without an admin.                                                 |
| `CONFLICT`             | 409  | Another state conflict not covered above.                                                              |
| `RATE_LIMITED`         | 429  | Too many requests. See `Retry-After`.                                                                  |
| `INTERNAL_ERROR`       | 500  | Unexpected server error. The details are logged on the server, not returned.                           |

### 3.2 Status code conventions

| Status | Used for                                                     |
| ------ | ------------------------------------------------------------ |
| 200    | Successful read, update, or action that returns a body       |
| 201    | Resource created. The response includes a `Location` header. |
| 204    | Resource deleted, or a successful action with no body        |
| 400    | Malformed input                                              |
| 401    | Not signed in                                                |
| 403    | Signed in and a member, but the role is insufficient         |
| 404    | Not found, or not visible to the caller                      |
| 409    | State conflict                                               |
| 422    | Input is well formed but breaks a business rule              |
| 429    | Rate limit exceeded                                          |
| 500    | Server error                                                 |

## 4. Route summary

| Method   | Path                                                 | Who may call                  | Success | Purpose                                               |
| -------- | ---------------------------------------------------- | ----------------------------- | ------- | ----------------------------------------------------- |
| `GET`    | `/api/profile`                                       | Signed-in user                | 200     | Get the caller's profile                              |
| `PATCH`  | `/api/profile`                                       | Signed-in user                | 200     | Update display name                                   |
| `GET`    | `/api/households`                                    | Signed-in user                | 200     | List the caller's households                          |
| `POST`   | `/api/households`                                    | Signed-in user                | 201     | Create a household; the caller becomes admin          |
| `GET`    | `{base}`                                             | Member                        | 200     | Get household details                                 |
| `PATCH`  | `{base}`                                             | Admin                         | 200     | Update name, time zone, or currency                   |
| `DELETE` | `{base}`                                             | Admin                         | 204     | Delete the household and all its data                 |
| `GET`    | `{base}/members`                                     | Member                        | 200     | List members                                          |
| `PATCH`  | `{base}/members/{userId}`                            | Admin                         | 200     | Change a member's role                                |
| `DELETE` | `{base}/members/{userId}`                            | Admin, or the member themself | 204     | Remove a member, or leave the household               |
| `GET`    | `{base}/invitations`                                 | Admin                         | 200     | List invitations and their status (no codes)          |
| `POST`   | `{base}/invitations`                                 | Admin                         | 201     | Create an invitation; the code is returned once       |
| `POST`   | `{base}/invitations/{invitationId}/revoke`           | Admin                         | 200     | Revoke an invitation                                  |
| `POST`   | `/api/invitations/redeem`                            | Signed-in user                | 200     | Join a household with an invitation code              |
| `GET`    | `{base}/tasks`                                       | Member                        | 200     | List tasks                                            |
| `POST`   | `{base}/tasks`                                       | Admin                         | 201     | Create a task                                         |
| `GET`    | `{base}/tasks/{taskId}`                              | Member                        | 200     | Get a task                                            |
| `PATCH`  | `{base}/tasks/{taskId}`                              | Admin                         | 200     | Update a task                                         |
| `DELETE` | `{base}/tasks/{taskId}`                              | Admin                         | 200     | Archive a task                                        |
| `GET`    | `{base}/tasks/{taskId}/occurrences`                  | Member                        | 200     | List a task's occurrences and their status in a range |
| `GET`    | `{base}/completions`                                 | Member                        | 200     | List completions in a range                           |
| `POST`   | `{base}/tasks/{taskId}/completions`                  | Assignee or admin             | 201     | Complete an occurrence and award points               |
| `DELETE` | `{base}/tasks/{taskId}/completions/{occurrenceDate}` | Assignee or admin             | 200     | Reopen an occurrence and reverse its points           |
| `GET`    | `{base}/grocery-lists`                               | Member                        | 200     | List grocery lists                                    |
| `POST`   | `{base}/grocery-lists`                               | Member                        | 201     | Create a grocery list                                 |
| `GET`    | `{base}/grocery-lists/{listId}`                      | Member                        | 200     | Get a list with its items                             |
| `PATCH`  | `{base}/grocery-lists/{listId}`                      | Member                        | 200     | Rename a list                                         |
| `DELETE` | `{base}/grocery-lists/{listId}`                      | Member                        | 204     | Delete a list and its items                           |
| `POST`   | `{base}/grocery-lists/{listId}/items`                | Member                        | 201     | Add an item                                           |
| `PATCH`  | `{base}/grocery-lists/{listId}/items/{itemId}`       | Member                        | 200     | Edit an item, or set its purchased status             |
| `DELETE` | `{base}/grocery-lists/{listId}/items/{itemId}`       | Member                        | 204     | Delete an item                                        |
| `GET`    | `{base}/calendar`                                    | Member                        | 200     | List events and task deadlines in a range             |
| `POST`   | `{base}/calendar/events`                             | Member                        | 201     | Create an event                                       |
| `GET`    | `{base}/calendar/events/{eventId}`                   | Member                        | 200     | Get an event                                          |
| `PATCH`  | `{base}/calendar/events/{eventId}`                   | Creator or admin              | 200     | Update an event                                       |
| `DELETE` | `{base}/calendar/events/{eventId}`                   | Creator or admin              | 204     | Delete an event                                       |
| `GET`    | `{base}/expenses`                                    | Member                        | 200     | List expenses in a range                              |
| `POST`   | `{base}/expenses`                                    | Member                        | 201     | Record an expense                                     |
| `GET`    | `{base}/expenses/summary`                            | Member                        | 200     | Monthly totals by category                            |
| `GET`    | `{base}/expenses/{expenseId}`                        | Member                        | 200     | Get an expense                                        |
| `PATCH`  | `{base}/expenses/{expenseId}`                        | Creator or admin              | 200     | Update an expense                                     |
| `DELETE` | `{base}/expenses/{expenseId}`                        | Creator or admin              | 204     | Delete an expense                                     |
| `GET`    | `{base}/leaderboard`                                 | Member                        | 200     | Get the household ranking                             |

Under SvelteKit's routing rules, the static segment `summary` takes precedence over the `[expenseId]` parameter, so `GET .../expenses/summary` never reaches the expense-by-ID handler.

## 5. Route details

### 5.1 Profile

`GET /api/profile` returns the caller's profile:

```json
{
	"id": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
	"displayName": "Sam",
	"createdAt": "2026-11-01T14:03:22Z",
	"updatedAt": "2026-11-01T14:03:22Z"
}
```

`PATCH /api/profile` accepts `{ "displayName": "Sam R." }`. `displayName` is trimmed and must be 1 to 50 characters.

### 5.2 Households

| Method  | Path              | Validation                                                                                                   |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `POST`  | `/api/households` | `name`: 1 to 80 characters. `timeZone`: a valid IANA name. `currencyCode`: three uppercase ISO 4217 letters. |
| `PATCH` | `{base}`          | Any subset of the same fields.                                                                               |

Create a household:

```http
POST /api/households
Content-Type: application/json

{
  "name": "Rivera House",
  "timeZone": "America/Denver",
  "currencyCode": "USD"
}
```

```http
HTTP/1.1 201 Created
Location: /api/households/9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60

{
  "id": "9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60",
  "name": "Rivera House",
  "timeZone": "America/Denver",
  "currencyCode": "USD",
  "myRole": "admin",
  "createdAt": "2026-11-19T16:00:00Z"
}
```

Creation calls the `create_household` function, which inserts the household and the admin membership in one transaction.

`GET /api/households` returns each household with the caller's role:

```json
{
	"items": [
		{ "id": "9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60", "name": "Rivera House", "myRole": "admin" }
	]
}
```

`DELETE {base}` removes the household and cascades to all of its data, including the points ledger. The UI should require the admin to type the household name before the request is sent. The API itself only checks the role.

### 5.3 Members

`GET {base}/members` returns display names and roles. Email addresses are never returned.

```json
{
	"items": [
		{
			"userId": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
			"displayName": "Sam",
			"role": "admin",
			"joinedAt": "2026-11-19T16:00:00Z"
		},
		{
			"userId": "b7d2e0f4-1a3c-4b5d-9e8f-0c1d2e3f4a5b",
			"displayName": "Alex",
			"role": "member",
			"joinedAt": "2026-11-20T09:12:45Z"
		}
	]
}
```

`PATCH {base}/members/{userId}` accepts `{ "role": "admin" | "member" }`. A member cannot change their own role.

`DELETE {base}/members/{userId}` removes a member. An admin can remove anyone. A member can call it with their own ID to leave. Removing or demoting the last admin returns `409 LAST_ADMIN_REQUIRED`, and the household must be deleted or another admin promoted first. Removing a member clears their task assignments (`ON DELETE SET NULL`) but keeps their points history.

### 5.4 Invitations

Invitation codes are generated on the server and shown once. The API never returns a stored code hash, and never returns a code after creation.

`POST {base}/invitations` accepts:

| Field           | Type    | Rule    | Default |
| --------------- | ------- | ------- | ------- |
| `expiresInDays` | integer | 1 to 30 | 7       |
| `maxUses`       | integer | 1 to 20 | 1       |

```http
POST /api/households/9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60/invitations
Content-Type: application/json

{ "expiresInDays": 7, "maxUses": 1 }
```

```http
HTTP/1.1 201 Created

{
  "invitation": {
    "id": "e4a1c7d2-8b3f-4f6e-a2d9-1c5b7e8f0a3d",
    "status": "active",
    "createdAt": "2026-11-19T16:05:00Z",
    "expiresAt": "2026-11-26T16:05:00Z",
    "maxUses": 1,
    "useCount": 0
  },
  "code": "2KQ4-7MNT-XW9R-HV3D",
  "codeNotice": "Share this code now. It cannot be shown again."
}
```

The code shown here is an example value. The code is formatted as four groups of four characters from a 32-character alphabet, with no ambiguous characters (I, L, O, and U are excluded).

`GET {base}/invitations` returns the same metadata without `code`. `status` is derived: `active`, `expired`, `revoked`, or `exhausted` (all uses consumed).

`POST {base}/invitations/{invitationId}/revoke` sets `revoked_at` and returns the updated invitation with `status: "revoked"`. Revoking an already revoked invitation returns `200` with the same body.

`POST /api/invitations/redeem` accepts `{ "code": "2KQ4-7MNT-XW9R-HV3D" }`. The server removes hyphens and spaces and converts the code to uppercase before hashing, so the user may type it in any of those forms.

```http
HTTP/1.1 200 OK

{
  "household": { "id": "9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60", "name": "Rivera House" },
  "role": "member"
}
```

Redemption rules:

- An unknown, revoked, expired, or used-up code returns `404 INVITATION_INVALID`. The same message covers all four cases, so a caller cannot tell them apart.
- A caller who is already a member returns `409 ALREADY_MEMBER`. The invitation's use count does not change.
- Successful redemption always grants the `member` role.

### 5.5 Tasks

Tasks are managed by admins. Members see tasks and complete the ones assigned to them.

| Field         | Type    | Rule                                                        | Required              |
| ------------- | ------- | ----------------------------------------------------------- | --------------------- |
| `title`       | string  | 1 to 120 characters after trimming                          | Yes                   |
| `description` | string  | Up to 2000 characters, or `null`                            | No                    |
| `assigneeId`  | UUID    | A current member of the household, or `null` for unassigned | No                    |
| `priority`    | enum    | `low`, `medium`, or `high`                                  | No (default `medium`) |
| `pointsValue` | integer | 0 to 100                                                    | No (default 0)        |
| `dueDate`     | date    | `YYYY-MM-DD`. For recurring tasks, the first occurrence.    | Yes                   |
| `recurrence`  | enum    | `none`, `daily`, `weekly`, or `monthly`                     | No (default `none`)   |

Create a task:

```http
POST /api/households/9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60/tasks
Content-Type: application/json

{
  "title": "Take out recycling",
  "description": "Bins go to the curb by 7 AM.",
  "assigneeId": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
  "priority": "high",
  "pointsValue": 10,
  "dueDate": "2026-11-02",
  "recurrence": "weekly"
}
```

```http
HTTP/1.1 201 Created

{
  "id": "5c8e1f2a-7d3b-4e9c-b1a0-6f2d8e4c9b17",
  "householdId": "9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60",
  "title": "Take out recycling",
  "description": "Bins go to the curb by 7 AM.",
  "assigneeId": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
  "priority": "high",
  "pointsValue": 10,
  "dueDate": "2026-11-02",
  "recurrence": "weekly",
  "archivedAt": null,
  "createdAt": "2026-11-19T16:10:00Z",
  "updatedAt": "2026-11-19T16:10:00Z"
}
```

`PATCH {base}/tasks/{taskId}` accepts any subset of these fields. Changing `pointsValue` does not alter awards already recorded.

`DELETE {base}/tasks/{taskId}` archives the task by setting `archivedAt`. Archived tasks are hidden from default lists and no longer produce occurrences, but their history remains.

`GET {base}/tasks` accepts optional filters: `assigneeId`, `priority`, and `includeArchived` (boolean, default `false`). Members can read archived tasks, as RLS allows, so the filter only affects what the list shows.

`GET {base}/tasks/{taskId}/occurrences?from=2026-11-01&to=2026-11-30` returns each scheduled occurrence in the range and its status:

```json
{
	"items": [
		{
			"taskId": "5c8e1f2a-7d3b-4e9c-b1a0-6f2d8e4c9b17",
			"occurrenceDate": "2026-11-09",
			"status": "completed",
			"overdue": false,
			"completionId": "a1b2c3d4-0000-4000-8000-000000000001",
			"completedBy": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
			"completedAt": "2026-11-09T18:42:10Z"
		},
		{
			"taskId": "5c8e1f2a-7d3b-4e9c-b1a0-6f2d8e4c9b17",
			"occurrenceDate": "2026-11-16",
			"status": "open",
			"overdue": true,
			"completionId": null,
			"completedBy": null,
			"completedAt": null
		}
	]
}
```

`status` is `completed` when there is an active completion, and `open` otherwise. `overdue` is `true` for an open occurrence whose date is before today. It is a display flag only. Overdue occurrences can still be completed, and they award points the same way as on-time ones. Occurrences after today are returned as `open` and cannot be completed yet.

### 5.6 Completions

Completing and reopening apply to one occurrence at a time. Both actions call database functions that run in a single transaction, as described in [database.md, section 7](database.md#7-atomic-point-transactions).

`POST {base}/tasks/{taskId}/completions` accepts:

```json
{ "occurrenceDate": "2026-11-16" }
```

Checks, in order:

1. The caller is a member. Otherwise `404 NOT_FOUND`.
2. The caller is the assignee or an admin. Otherwise `403 FORBIDDEN`.
3. The date is a scheduled occurrence of the task. Otherwise `422 INVALID_OCCURRENCE`.
4. The date is no later than today, in the household's time zone. Overdue dates are allowed. Otherwise `422 OCCURRENCE_IN_FUTURE`.
5. No active completion exists for the occurrence. Otherwise `409 ALREADY_COMPLETED`.

```http
HTTP/1.1 201 Created
Location: /api/households/9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60/completions/a1b2c3d4-0000-4000-8000-000000000002

{
  "completion": {
    "id": "a1b2c3d4-0000-4000-8000-000000000002",
    "taskId": "5c8e1f2a-7d3b-4e9c-b1a0-6f2d8e4c9b17",
    "occurrenceDate": "2026-11-16",
    "completedBy": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
    "completedAt": "2026-11-16T18:42:10Z",
    "reopenedAt": null
  },
  "assigneeId": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
  "pointsAwarded": 10
}
```

`pointsAwarded` is `0` when the task is unassigned or worth no points. No award is written in that case.

`DELETE {base}/tasks/{taskId}/completions/{occurrenceDate}` reopens the occurrence. The path uses the occurrence date, so no completion ID is needed. The same assignee-or-admin rule applies.

```http
HTTP/1.1 200 OK

{
  "completion": {
    "id": "a1b2c3d4-0000-4000-8000-000000000002",
    "taskId": "5c8e1f2a-7d3b-4e9c-b1a0-6f2d8e4c9b17",
    "occurrenceDate": "2026-11-16",
    "completedBy": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
    "completedAt": "2026-11-16T18:42:10Z",
    "reopenedAt": "2026-11-16T20:05:31Z"
  },
  "pointsReversed": 10
}
```

Reopening an occurrence with no active completion returns `409 NOT_COMPLETED`. Reopening has no date limit, because it only reverses points that were recorded.

`GET {base}/completions?from=2026-11-01&to=2026-11-30` returns completions in the range, including reopened ones. Each item includes `reopenedAt` so the UI can show history.

### 5.7 Grocery lists

Any member can manage grocery lists and items.

| Resource | Field         | Rule                                                                   |
| -------- | ------------- | ---------------------------------------------------------------------- |
| List     | `name`        | 1 to 80 characters after trimming                                      |
| Item     | `name`        | 1 to 120 characters after trimming                                     |
| Item     | `quantity`    | Up to 40 characters, or `null`                                         |
| Item     | `isPurchased` | Boolean. Setting it to `true` records who purchased the item and when. |

`GET {base}/grocery-lists/{listId}` returns the list with its items:

```json
{
	"id": "c0ffee00-1111-4222-8333-444455556666",
	"name": "Weekend shop",
	"items": [
		{
			"id": "d1d1d1d1-2222-4333-8444-555566667777",
			"name": "Milk",
			"quantity": "2 L",
			"isPurchased": true,
			"purchasedBy": "b7d2e0f4-1a3c-4b5d-9e8f-0c1d2e3f4a5b",
			"purchasedAt": "2026-11-21T15:20:00Z"
		},
		{
			"id": "e2e2e2e2-3333-4444-8555-666677778888",
			"name": "Eggs",
			"quantity": "1 dozen",
			"isPurchased": false,
			"purchasedBy": null,
			"purchasedAt": null
		}
	]
}
```

Add an item:

```http
POST /api/households/9b0e6c3a-2f4d-4e7a-8c1b-5d3f7a9e2b60/grocery-lists/c0ffee00-1111-4222-8333-444455556666/items
Content-Type: application/json

{ "name": "Bananas", "quantity": "6" }
```

Mark an item purchased with `PATCH .../items/{itemId}` and `{ "isPurchased": true }`. Setting it back to `false` clears `purchasedBy` and `purchasedAt`.

### 5.8 Calendar

`GET {base}/calendar?from=2026-11-20&to=2026-11-30` returns events and task deadlines together. Task deadlines come from tasks and their occurrences, so they are not stored as calendar events.

```json
{
	"items": [
		{
			"type": "event",
			"id": "f3f3f3f3-4444-4555-8666-777788889999",
			"title": "Dentist",
			"startsAt": "2026-11-24T15:00:00Z",
			"endsAt": "2026-11-24T15:45:00Z"
		},
		{
			"type": "task_deadline",
			"taskId": "5c8e1f2a-7d3b-4e9c-b1a0-6f2d8e4c9b17",
			"title": "Take out recycling",
			"date": "2026-11-23",
			"completed": false
		}
	]
}
```

`POST {base}/calendar/events` accepts `title` (1 to 120 characters), `description` (optional, up to 2000 characters), `startsAt`, and `endsAt`. Both timestamps are required, and `endsAt` must be after `startsAt`.

### 5.9 Expenses

| Field         | Type    | Rule                                                                                         |
| ------------- | ------- | -------------------------------------------------------------------------------------------- |
| `amountCents` | integer | 1 to 100000000                                                                               |
| `category`    | enum    | `groceries`, `utilities`, `housing`, `transportation`, `health`, `entertainment`, or `other` |
| `spentOn`     | date    | `YYYY-MM-DD`                                                                                 |
| `description` | string  | Up to 200 characters, or `null`                                                              |
| `paidBy`      | UUID    | A current member of the household, or `null`                                                 |

Categories are a fixed set in version 1. Custom categories would need a separate table and are not planned.

`GET {base}/expenses/summary?month=2026-11` returns totals for the month:

```json
{
	"month": "2026-11",
	"currencyCode": "USD",
	"totalCents": 48210,
	"byCategory": [
		{ "category": "groceries", "totalCents": 31500 },
		{ "category": "utilities", "totalCents": 16710 }
	]
}
```

Categories with no expenses are omitted. `totalCents` equals the sum of the `byCategory` values.

### 5.10 Leaderboard

`GET {base}/leaderboard` accepts optional `from` and `to`. Without them, the ranking covers all time.

```json
{
	"from": null,
	"to": null,
	"entries": [
		{
			"rank": 1,
			"userId": "3f1c2a9e-5b7d-4c1a-9e2f-8a6d0b4c7e11",
			"displayName": "Sam",
			"points": 42
		},
		{
			"rank": 2,
			"userId": "b7d2e0f4-1a3c-4b5d-9e8f-0c1d2e3f4a5b",
			"displayName": "Alex",
			"points": 30
		},
		{
			"rank": 2,
			"userId": "d4e5f6a7-8b9c-4d0e-9f1a-2b3c4d5e6f70",
			"displayName": "Jordan",
			"points": 30
		},
		{
			"rank": 4,
			"userId": "e5f6a7b8-9c0d-4e1f-8a2b-3c4d5e6f7a81",
			"displayName": "Riley",
			"points": 0
		}
	]
}
```

- Points are the sum of the household's ledger entries for each **current** member, so awards and reversals both count.
- Ranks use competition ranking. Tied members share a rank, and the next rank skips the tied positions (1, 2, 2, 4).
- Members with no points still appear, with `points: 0`.
- The response is derived from `point_transactions`. It is not read from a stored total.

## 6. Validation and rate limits

### 6.1 Shared validation rules

- Strings are trimmed before length checks.
- Unknown fields in a request body are rejected with `400 VALIDATION_FAILED`. This prevents clients from setting server-owned fields such as `createdBy` or `completedAt`.
- Dates must be real calendar dates. `2026-02-30` is rejected.
- Timestamps must include a time zone offset or `Z`.
- Enum values are matched exactly, with no case folding.

### 6.2 Proposed rate limits

These limits are proposals to be confirmed during implementation. They are not measured values.

| Route group           | Limit                   | Key            |
| --------------------- | ----------------------- | -------------- |
| Invitation redemption | 5 attempts per minute   | Caller user ID |
| Invitation redemption | 20 attempts per hour    | Client IP      |
| Completion and reopen | 30 requests per minute  | Caller user ID |
| All other mutations   | 120 requests per minute | Caller user ID |
| Reads                 | 300 requests per minute | Caller user ID |

The limiter itself is not chosen yet. The options are an in-database counter table, or the rate limiting provided by the hosting platform.

## 7. Realtime is not an API

Realtime events are delivered through the Supabase client, not through these routes. The client subscribes to the tables listed in [system.md, section 4.4](system.md#44-real-time-updates), filtered by `household_id`. The events follow the same RLS rules as the API. After a `DELETE` event, the client refetches the affected list because deleted rows arrive without their contents.
