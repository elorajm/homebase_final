# HomeBase Deployment and Quality Plan

> **Status: mostly planned.** This document describes how HomeBase will be deployed, tested, and checked for performance and accessibility. Only the items marked **implemented** exist in the repository today. No deployment has been created, and no performance or accessibility measurements have been taken.

## 1. Current state

| Item                                                                                 | Status                      | Notes                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend preview: route groups, application shell, signed-in pages, and sample data  | Implemented                 | Route groups `(app)` and `(auth)`. All data is typed sample data.                                                                                                                                                      |
| Authentication pages: sign in, create account, and reset password                    | Implemented as placeholders | They validate input and report that the action is not connected. No authentication is implemented.                                                                                                                     |
| `@sveltejs/adapter-vercel` installed and passed to `sveltekit()` in `vite.config.ts` | Implemented                 | The project has no `svelte.config.js`. The build log shows `Using @sveltejs/adapter-vercel`.                                                                                                                           |
| Production build (`npm run build`)                                                   | Implemented                 | Passes on the verification machine, where Windows Developer Mode is enabled. Without symlink permission it fails on Windows. See [setup.md, section 10.1](setup.md#101-windows-symlink-error-during-production-build). |
| Vitest configuration (`server` and `client` projects)                                | Implemented                 | 20 test files and 63 tests at the time of the last update. See section 5.                                                                                                                                              |
| Playwright configuration and end-to-end tests                                        | Implemented                 | 22 tests across the navigation, authentication, and home-page suites.                                                                                                                                                  |
| Type checking (`svelte-check`), ESLint, and Prettier                                 | Implemented                 | 0 errors and 0 warnings, 0 ESLint problems, and Prettier passes.                                                                                                                                                       |
| Vercel project linked to the GitHub repository                                       | Planned                     | No Vercel project exists yet.                                                                                                                                                                                          |
| Environment variables in Vercel                                                      | Planned                     | See section 2.3.                                                                                                                                                                                                       |
| Supabase development and production projects                                         | Planned                     | See section 3.                                                                                                                                                                                                         |
| GitHub Actions workflow (`.github/workflows/`)                                       | Planned                     | The `.github` directory does not exist yet.                                                                                                                                                                            |
| Lighthouse CI                                                                        | Planned                     | No Lighthouse configuration exists yet.                                                                                                                                                                                |
| Automated accessibility checks                                                       | Planned                     | No accessibility testing package is installed.                                                                                                                                                                         |
| Database and RLS tests                                                               | Planned                     | See [database.md, section 12](database.md#12-migrations-and-verification-planned).                                                                                                                                     |

## 2. Vercel deployment (planned)

### 2.1 Project setup

1. Import the GitHub repository into Vercel as a new project.
2. Use the SvelteKit framework preset. Vercel detects the adapter, so no custom build command is required beyond `npm run build`.
3. Set the Node.js version in the Vercel project to 22.x, matching the version in [setup.md](setup.md#1-prerequisites). The application requires Node.js 22.17 or later.
4. Keep the default install command (`npm install`), or change it to `npm ci` once CI relies on the lockfile.
5. Choose a Vercel region close to the Supabase project's region, so server-side database requests are short.

No production URL exists yet. When a domain is assigned, it should be added to this document and to the Supabase Auth redirect list. Until then, treat any URL as unknown.

### 2.2 Environments

| Environment | Trigger                              | Supabase project                             | Purpose                       |
| ----------- | ------------------------------------ | -------------------------------------------- | ----------------------------- |
| Local       | `npm run dev` on a developer machine | Local Supabase stack, or development project | Day-to-day work               |
| Preview     | Every pull request                   | Development project (recommended)            | Review changes before merging |
| Production  | Merge to `main`                      | Production project                           | Users of the live application |

Preview deployments must not use production data. Give them the development project's variables.

### 2.3 Environment variables

Set these in Vercel for each environment that needs them. Use the same names as in [setup.md, section 7](setup.md#7-environment-variables).

| Variable                    | Preview                      | Production                  | Notes                                                                                             |
| --------------------------- | ---------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | Development project URL      | Production project URL      | Public                                                                                            |
| `PUBLIC_SUPABASE_ANON_KEY`  | Development anon key         | Production anon key         | Public. Safe only because RLS is enabled.                                                         |
| `SUPABASE_SERVICE_ROLE_KEY` | Only if needed               | Only if needed              | Server only. Mark it as sensitive in Vercel. Never expose it to the browser.                      |
| `INVITATION_HMAC_SECRET`    | A separate development value | A separate production value | Server only. Use different values per environment, so preview codes cannot be used in production. |

Rules:

- Do not commit values to the repository or put them in documentation.
- Use Vercel's sensitive-variable setting for secrets, so their values cannot be read back in the dashboard.
- Rotating `INVITATION_HMAC_SECRET` invalidates outstanding invitation codes (see [database.md, section 9](database.md#9-invitation-storage-and-redemption)).

### 2.4 Rollback

Vercel keeps previous deployments, and any of them can be promoted again from the dashboard. Database changes are not rolled back this way. Migrations move forward, so a bad schema change is fixed with a new migration (see section 3.3).

## 3. Supabase configuration (planned)

### 3.1 Projects and keys

- Create separate development and production projects. Never point a local `.env` at the production project.
- The anon key is public. The service-role key bypasses RLS, so it stays out of client code, `PUBLIC_` variables, logs, and documentation.
- Keep the database password in a password manager. Do not store it in the repository.

### 3.2 Authentication settings

| Setting            | Planned value                                                                         |
| ------------------ | ------------------------------------------------------------------------------------- |
| Site URL           | The production URL, once it exists                                                    |
| Redirect URLs      | `http://localhost:5173`, the Vercel preview URL pattern, and the production URL       |
| Email confirmation | Enabled                                                                               |
| Anonymous sign-ins | Disabled. Every feature requires a signed-in user.                                    |
| Password policy    | Minimum length set by the team, with leaked-password checks if the plan supports them |

Confirm each setting in the dashboard and record the decision here when it is made. Do not copy dashboard screenshots containing project keys into the documentation.

### 3.3 Schema changes

- Every schema change is a migration file in `supabase/migrations/`, applied in order.
- Changes are made locally first, tested, then applied to the development project, then to production.
- Applied migrations are never edited. A correction is a new migration.
- Before a migration reaches production, the team checks that RLS is still enabled on every table in the `public` schema.

### 3.4 Realtime

Add these tables to the `supabase_realtime` publication: `tasks`, `task_completions`, `point_transactions`, `grocery_lists`, `grocery_items`, and `calendar_events`. Realtime respects RLS, so the publication does not expose any extra data. Confirm this with a test when Realtime is implemented.

### 3.5 Free-tier and plan limits

The team is using the Supabase free tier during development. Check the current Supabase pricing and limits before relying on any of the following:

- Storage, bandwidth, and monthly active user limits.
- Whether projects are paused after a period without activity. A paused project must be restored before the application works again.
- Backup and point-in-time recovery availability, which may require a paid plan.

The limits change over time, so they are not recorded here. See [ADR 002](adrs/002-supabase.md) for the trade-offs.

## 4. GitHub Actions CI/CD (planned)

The workflow will live in `.github/workflows/ci.yml`. The following job list is the plan, not a committed file.

| Job          | Trigger                                            | Steps                                                                                                                                                                                                                                            | Blocks merge |
| ------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| `verify`     | Pull requests, and pushes to `main`                | Check out code. Set up Node.js 22. Run `npm ci`. Run `npm run check`. Run `npm run lint`. Run `npm run test:unit -- --run`. Run `npm run build`. Install Chromium with `npx playwright install --with-deps chromium`. Run `npx playwright test`. | Yes          |
| `lighthouse` | Pull requests, after a preview deployment is ready | Run Lighthouse CI against the preview URL and record the scores. See section 6.                                                                                                                                                                  | Planned      |
| `database`   | Pull requests that change `supabase/`              | Start the local Supabase stack, apply migrations, and run the database tests described in [database.md, section 12](database.md#12-migrations-and-verification-planned).                                                                         | Planned      |

Notes:

- The `verify` job runs `npx playwright test` directly instead of `npm run test:e2e`. The script's `playwright install` step is already covered by `--with-deps`, so running it twice would waste time.
- Vercel's Git integration builds previews and production deployments. The workflow does not deploy by itself.
- The Windows symlink issue in [setup.md](setup.md#101-windows-symlink-error-during-production-build) is not expected on Linux runners. Confirm this when the workflow first runs.
- Branch protection on `main` should require the `verify` job to pass before merging.
- Secrets needed by CI, such as Supabase test credentials, are stored as GitHub Actions secrets and are never printed in logs.

## 5. Testing strategy

| Layer                  | Tool                                                  | Scope                               | Current state                                                                                                                                           | Planned coverage                                                                                                                                   |
| ---------------------- | ----------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type checking          | `svelte-check`                                        | All Svelte and TypeScript files     | Implemented. 0 errors and 0 warnings.                                                                                                                   | Keep it passing on every pull request                                                                                                              |
| Formatting and linting | Prettier and ESLint                                   | All files                           | Implemented. Both pass.                                                                                                                                 | Zero errors before merge                                                                                                                           |
| Unit tests             | Vitest, `server` project (Node.js)                    | `src/**/*.{test,spec}.ts`           | Implemented. 13 files, 46 tests: domain logic, mock-data integrity, navigation and public URLs, and authentication validation and placeholder behavior. | Invitation code generation and normalization, recurrence date rules, and role and permission helpers once they exist                               |
| Component tests        | Vitest browser mode with `vitest-browser-svelte`      | `src/**/*.svelte.{test,spec}.ts`    | Implemented. 7 files, 17 tests: mobile navigation, task filters, add-task validation, and the sign-in, registration, and password-reset forms.          | Remaining feature components in loading, empty, success, and error states                                                                          |
| End-to-end tests       | Playwright                                            | `src/**/*.e2e.ts`                   | Implemented. 22 tests: every signed-in page, desktop and mobile navigation, the authentication pages, and the home-page redirect.                       | Sign-up and login against Supabase, invitation redemption, completing a task once, reopening it, and seeing another browser's update via real-time |
| Database and RLS tests | Planned: local Supabase with SQL or integration tests | `supabase/` migrations and policies | Planned                                                                                                                                                 | Cross-household isolation, duplicate completion and reversal prevention, ledger immutability, last-admin protection                                |

Coverage thresholds have not been set. The team should decide on them after the first authentication and feature tests exist, and this document will be updated then.

## 6. Performance targets

| Target                         | Value                                                                                         | Status                 |
| ------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------- |
| Lighthouse performance score   | Above 90 for the key pages (login, dashboard) on mobile emulation                             | Planned. Not measured. |
| Lighthouse accessibility score | Reported on each run, and treated as a regression signal alongside the WCAG work in section 7 | Planned. Not measured. |

Rules for the performance targets:

- A Lighthouse score is a lab measurement. It is not a guarantee for real users, so the team should also watch field data when it becomes available.
- Scores are recorded in pull request comments or in the CI log, along with the commit they came from. A number without a commit is not useful.
- Until the lighthouse job exists, no score should be reported in a presentation or README as achieved.

## 7. Accessibility (WCAG 2.1 AA)

The target is conformance with WCAG 2.1 Level AA for every screen. The team will check these areas during development:

| Area              | Requirement                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Structure         | Semantic HTML: one `h1` per page, real headings in order, landmarks for navigation and main content                               |
| Keyboard          | Every action is reachable and usable with a keyboard. No keyboard traps. Focus order follows the visual order.                    |
| Focus             | Visible focus indicator on every interactive element. Focus is moved to the first error after a failed submit.                    |
| Contrast          | Body text at least 4.5:1 against its background. Large text and essential graphics at least 3:1.                                  |
| Forms             | Every input has a programmatic label. Errors are linked to their fields and described in text, not color alone.                   |
| Dynamic updates   | Real-time changes and status messages (for example, "Task completed") are announced through live regions, without stealing focus. |
| Motion            | Animations respect `prefers-reduced-motion`.                                                                                      |
| Responsive layout | Content reflows at narrow widths without horizontal scrolling and without loss of information.                                    |
| Touch targets     | Interactive controls are large enough to tap comfortably on mobile devices.                                                       |

Tools planned for this work:

- Automated checks with an accessibility engine (for example, axe) run from Playwright tests. The package is not installed yet.
- Manual checks with a keyboard and at least one screen reader before each milestone demonstration.

Automated tools find only part of WCAG. A passing automated check does not mean the requirement is fully met.

## 8. Release checklist (planned)

Before a release to production:

1. The `verify` job passes on the release commit.
2. The preview deployment has been tested by hand on desktop and mobile widths.
3. Any new migration has been applied to the development project and checked for RLS coverage.
4. New environment variables have been added to Vercel for the production environment.
5. Supabase Auth redirect URLs include the production URL.
6. The lighthouse results for the key pages are recorded, and any score below 90 has a noted reason.
7. This document, [setup.md](setup.md), and [api.md](api.md) have been updated to match the code.
