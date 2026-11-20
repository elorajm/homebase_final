# HomeBase Setup Guide

This guide gets a new developer from a fresh clone to a running copy of the application. It covers only what the repository supports today. Steps that depend on Supabase, Vercel, or GitHub Actions are marked **planned**.

> **Current state:** the repository runs a frontend preview. Every planned page is built on sample data, and the public sign-in pages are placeholders. There is no database connection, no real authentication, and no environment variables are required yet.

## 1. Prerequisites

| Requirement  | Version or detail       | Notes                                                                                                        |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Node.js      | 22.17 or later          | Set by `@sveltejs/kit` 3.4.0 (`engines.node >= 22.17`). Verified with v22.19.0.                              |
| npm          | Ships with Node.js      | Verified with npm 10.9.3. `.npmrc` sets `engine-strict=true`, so npm refuses to install on an older Node.js. |
| Git          | Any recent version      |                                                                                                              |
| Chromium     | Installed by Playwright | Needed for browser component tests and end-to-end tests. See section 6.                                      |
| Supabase CLI | **Planned**             | Needed for the local database stack. Requires Docker. See section 8.                                         |

The dependencies declare these minimums, and Node.js 22.17 or later satisfies all of them:

| Package         | Installed version | Node.js requirement                   |
| --------------- | ----------------- | ------------------------------------- |
| `@sveltejs/kit` | 3.4.0             | `>=22.17`                             |
| `vite`          | 8.3.8             | `^20.19.0 \|\| >=22.12.0`             |
| `vitest`        | 5.1.1             | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` |
| `eslint`        | 10.15.0           | `^20.19.0 \|\| ^22.13.0 \|\| >=24`    |

Use the Node.js version your team has standardized on. If you already use `nvm` or `fnm`, select a 22.x release that is 22.17 or later.

## 2. Install the project

```sh
git clone <your-repository-url> homebase_final
cd homebase_final
npm install
```

Replace `<your-repository-url>` with the address of the team's GitHub repository.

`npm install` also runs the `prepare` script, which runs `svelte-kit sync`. That script generates the `.svelte-kit/` directory, which the TypeScript configuration and `svelte-check` need.

Do not commit `node_modules/`, `.svelte-kit/`, `.vercel/`, or `build/`. They are listed in `.gitignore`.

## 3. Run the development server

```sh
npm run dev
```

Open the address printed in the terminal. Vite usually serves the app at `http://localhost:5173`. The home page redirects to the dashboard, which shows sample household data. The public sign-in pages are at `/login`, `/register`, and `/forgot-password`.

Use `npm run dev -- --open` to open a browser tab automatically.

## 4. npm scripts

These are the scripts defined in `package.json`:

| Script        | Runs                                                         | Purpose                                                                                |
| ------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `dev`         | `vite dev`                                                   | Development server with hot reload                                                     |
| `build`       | `vite build`                                                 | Production build. Uses `@sveltejs/adapter-vercel`, so output goes to `.vercel/output`. |
| `preview`     | `vite preview`                                               | Serves the last production build locally                                               |
| `prepare`     | `svelte-kit sync \|\| echo ''`                               | Runs automatically after `npm install`                                                 |
| `check`       | `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json` | Type checks the Svelte and TypeScript code                                             |
| `check:watch` | Same as `check`, with `--watch`                              | Type checks on every change                                                            |
| `lint`        | `prettier --check . && eslint .`                             | Verifies formatting, then runs ESLint                                                  |
| `format`      | `prettier --write .`                                         | Formats every file the Prettier configuration covers                                   |
| `test:unit`   | `vitest`                                                     | Vitest in watch mode. Add `-- --run` for a single run.                                 |
| `test:e2e`    | `playwright install && playwright test`                      | Installs browsers, builds the app, and runs `*.e2e.ts` tests                           |
| `test`        | `npm run test:unit -- --run && npm run test:e2e`             | Runs the unit tests once, then the end-to-end tests                                    |

`npm run format` changes files across the whole repository. Run `npm run lint` first to see what it would change.

## 5. Verify your setup

Run these commands in order after a fresh install:

```sh
npm run check
npm run lint
npm run test:unit -- --run
npm run build
```

Expected results on a correctly configured machine:

| Command                      | Expected result                                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`              | `svelte-check found 0 errors and 0 warnings`                                                                                     |
| `npm run lint`               | Prettier reports all files formatted, and ESLint reports no errors.                                                              |
| `npm run test:unit -- --run` | Both Vitest projects pass: `server` (Node.js) and `client` (Chromium, which requires `npx playwright install chromium`).         |
| `npm run build`              | Completes and logs `Using @sveltejs/adapter-vercel`. On Windows without symlink permission it fails with `EPERM` (section 10.1). |

## 6. Browser tests

The browser component tests and the end-to-end tests use Playwright's Chromium build. Install it once per machine:

```sh
npx playwright install chromium
```

`npm run test:e2e` runs `playwright install` automatically, which also downloads browsers, so it needs network access. On Linux CI runners, Playwright may also need system libraries. See [deployment.md](deployment.md#4-github-actions-cicd-planned).

The end-to-end configuration is in `playwright.config.ts`. It runs `npm run build && npm run preview` on port 4173 and matches files named `*.e2e.ts` or `*.e2e.js`. The current end-to-end tests are:

| File                            | What it checks                                                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/navigation.e2e.ts`  | Every signed-in page returns 200 and shows its heading. Desktop and mobile navigation work.                                         |
| `src/routes/auth.e2e.ts`        | Each authentication page renders without the app sidebar. Links between them work. Forms report that their action is not connected. |
| `src/routes/page.svelte.e2e.ts` | The home page redirects to the dashboard and shows a visible heading.                                                               |

Vitest has two projects, defined in `vite.config.ts`:

| Project  | Environment                 | Files                                                                |
| -------- | --------------------------- | -------------------------------------------------------------------- |
| `server` | Node.js                     | `src/**/*.{test,spec}.{js,ts}` (not component specs)                 |
| `client` | Chromium through Playwright | `src/**/*.svelte.{test,spec}.{js,ts}`, excluding `src/lib/server/**` |

## 7. Environment variables

The preview does not read any environment variables. The variables below are **planned** for the Supabase and invitation features.

| Variable                    | Scope       | Needed from      | Purpose                                                                                                                 |
| --------------------------- | ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | Public      | Supabase phase   | Project API URL from the Supabase dashboard. Read through `$env/static/public`.                                         |
| `PUBLIC_SUPABASE_ANON_KEY`  | Public      | Supabase phase   | The anon key. It is safe to ship to browsers because RLS limits what it can read and write.                             |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Only if required | Bypasses RLS. Use only in server code, and only when no RLS-respecting alternative exists. Never prefix with `PUBLIC_`. |
| `INVITATION_HMAC_SECRET`    | Server only | Invitation phase | Secret key for hashing invitation codes. Use at least 32 random bytes. Changing it invalidates outstanding invitations. |

Rules:

- Variables prefixed with `PUBLIC_` are available to browser code. Nothing else is. SvelteKit enforces this at build time.
- The service-role key and the invitation secret must not appear in any file under `src/routes` that runs in the browser, in logs, in documentation, or in commits.
- Local values go in a `.env` file at the project root. `.gitignore` already excludes `.env` and `.env.*`, so the file is not committed.
- A `.env.example` file with placeholder values is **planned**. `.gitignore` already allows it through the `!.env.example` rule. Its values must be placeholders such as `your-project-url`, never real credentials.
- Use separate Supabase projects for development and production, with separate values for each.

Generate an invitation secret without extra tools (works on Windows, macOS, and Linux with Node.js):

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Store the output in `.env` as `INVITATION_HMAC_SECRET=<output>`. Do not share it, and do not paste it into issues or chat.

## 8. Supabase setup (planned)

None of these steps are required yet. They describe the setup the team will follow once the Supabase features begin.

1. **Create two Supabase projects**: one for development and one for production. Choose the same region for both.
2. **Install the Supabase CLI** and start the local stack. The local stack runs in Docker.
   ```sh
   supabase init
   supabase start
   ```
3. **Add the Supabase client packages** to the project. These are not installed yet:
   ```sh
   npm install @supabase/supabase-js @supabase/ssr
   ```
4. **Copy the project URL and anon key** from the Supabase dashboard into your local `.env`. Never copy the service-role key into a file that the browser can read.
5. **Configure Auth** in the Supabase dashboard: set the Site URL, add `http://localhost:5173` and the planned Vercel preview and production URLs as redirect URLs, and enable email confirmation.
6. **Apply migrations** from `supabase/migrations/` (planned). Migrations are the only way the schema changes. See [database.md](database.md#12-migrations-and-verification-planned).
7. **Confirm RLS is enabled** on every table in the `public` schema before adding any data.
8. **Enable Realtime** for the tables listed in [system.md, section 4.4](system.md#44-real-time-updates).

## 9. Code conventions

| Area       | Rule                                                                                            | Source                                                 |
| ---------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Formatting | Tabs, single quotes, no trailing commas, print width 100. Tailwind classes are sorted.          | `prettier.config.js`                                   |
| Language   | Strict TypeScript. The `any` type is not allowed.                                               | `tsconfig.json`, `typescript-eslint` recommended rules |
| Linting    | ESLint with the type-checked TypeScript rules and Svelte rules.                                 | `eslint.config.js`                                     |
| Svelte     | Runes mode is forced for all project components.                                                | `vite.config.ts`                                       |
| Imports    | Shared code is imported through `#lib` (`src/lib`). Server-only code goes in `src/lib/server/`. | `package.json` imports field                           |
| Styling    | Tailwind CSS utility classes. The global stylesheet imports Tailwind and the forms plugin.      | `src/routes/layout.css`                                |

## 10. Known issues

Recorded during verification on 2026-11-20, on Windows 11 with Node.js v22.19.0.

| #   | Issue                                                                                                                                                       | Status                                                                                                                                                                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `npm run build` fails on Windows with `EPERM: operation not permitted, symlink` when Developer Mode is off and the terminal is not elevated (section 10.1). | Open for other machines. Developer Mode was enabled on the verification machine, outside this project, and the build passes there. The project does not add a workaround. |
| 2   | The client Vitest project and `npm run test:e2e` fail because Playwright's Chromium is not installed.                                                       | Install it with `npx playwright install chromium`. Every new machine needs this step.                                                                                     |
| 3   | The starter spec `src/lib/vitest-examples/Welcome.svelte.spec.ts` did not await `render`, which failed `@typescript-eslint/no-floating-promises`.           | Resolved. `render` returns a Promise, so the spec now awaits it.                                                                                                          |

### 10.1 Windows symlink error during production build

`@sveltejs/adapter-vercel` 7.0.5 creates a directory symlink for every route that is not prerendered. It calls `fs.symlinkSync` without a type argument (see `node_modules/@sveltejs/adapter-vercel/index.js`). Windows allows symlink creation only when Developer Mode is on or the process is elevated.

Developer Mode is on the verification machine. Its registry value (`AllowDevelopmentWithoutDevLicense`) is `1`, and it was off in an earlier session. The change was made outside this project, and the project does not depend on it.

Options for a Windows machine where the build fails:

- **Turn on Developer Mode** (Settings, System, For developers). This is a system-wide setting, so the team should agree to it first.
- **Run the build from an elevated terminal.** This needs no persistent setting change, but it must be repeated for every build.
- **Build on Linux.** CI runners or WSL with Node.js 22.17 or later both work. Vercel builds on Linux servers, so the production deployment is not affected by this issue.

The project does not contain a build workaround for this issue. A workaround that patches the adapter's file system calls would be fragile and would hide the cause. A local fallback that retried each failed directory symlink as a junction was tested during development and was not committed.

### 10.2 Verified results

Results from the verification run for this update:

- `npx prettier --check .`: all matched files use Prettier code style.
- `npx eslint .`: no problems.
- `svelte-check`: 0 errors and 0 warnings across 628 files.
- `vitest run`: 20 files and 63 tests passed (13 server files with 46 tests, and 7 browser files with 17 tests).
- `vite build`: passes with Developer Mode enabled.
- Playwright: 22 end-to-end tests passed, with no fallback loaded.
