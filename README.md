# HomeBase

HomeBase is a household management web application. Household members share chores, grocery lists, a calendar, and expenses in one place. Completed chores earn points, and each household has a leaderboard built from those points.

HomeBase is the final project for WDD 430, developed by a two-person team.

> **Project status: early development.** The repository currently contains a SvelteKit starter application and its tooling. None of the HomeBase features listed below are implemented yet. The `docs/` folder describes the planned design.

## Planned features

| Area        | Planned capability                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| Accounts    | Registration, login, logout, and profile management with Supabase Auth                                   |
| Households  | Shared households with administrator and member roles                                                    |
| Invitations | Secure, expiring, revocable invitation codes, stored only as keyed hashes                                |
| Tasks       | Shared chores with assignment, due dates, priorities, recurring schedules, and configurable point values |
| Points      | Automatic points for valid completions, reversed if a completion is reopened                             |
| Leaderboard | A ranking for each household, derived from recorded point transactions                                   |
| Groceries   | Shared grocery lists with items and purchased status                                                     |
| Calendar    | Shared household events alongside task deadlines                                                         |
| Expenses    | Categorized household expenses with monthly summaries                                                    |
| Real-time   | Live updates for shared tasks, grocery lists, and leaderboards                                           |
| Dashboard   | Responsive interface with loading, empty, success, and error states                                      |

## Current status

| Area                                                                                                              | Status                                               |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| SvelteKit project with strict TypeScript and Tailwind CSS (forms plugin)                                          | Implemented                                          |
| ESLint, Prettier, Vitest, and Playwright configuration                                                            | Implemented                                          |
| Vercel adapter (`@sveltejs/adapter-vercel`) in `vite.config.ts`                                                   | Implemented; no Vercel deployment exists yet         |
| Starter home page (default SvelteKit welcome content, no HomeBase content)                                        | Implemented                                          |
| Example tests (two Vitest examples and one Playwright smoke test)                                                 | Implemented; see the known issues in `docs/setup.md` |
| Project documentation in `docs/`                                                                                  | Implemented                                          |
| Authentication, households, invitations, tasks, points, leaderboard, groceries, calendar, expenses, and real-time | Planned                                              |
| Supabase project, database schema, and Row Level Security policies                                                | Planned                                              |
| Production deployment on Vercel and GitHub Actions CI                                                             | Planned                                              |

## Technology stack

| Layer                    | Technology                                        | Status                        |
| ------------------------ | ------------------------------------------------- | ----------------------------- |
| Application framework    | SvelteKit 3.4.0                                   | Installed                     |
| UI                       | Svelte 5.58.0 (runes mode)                        | Installed                     |
| Language                 | TypeScript 6.0.3 in strict mode                   | Installed                     |
| Styling                  | Tailwind CSS 4.3.5 with `@tailwindcss/forms`      | Installed                     |
| Build tool               | Vite 8.3.8                                        | Installed                     |
| Hosting adapter          | `@sveltejs/adapter-vercel` 7.0.5                  | Installed; deployment planned |
| Database                 | Supabase PostgreSQL                               | Planned                       |
| Authentication           | Supabase Auth                                     | Planned                       |
| Authorization            | Row Level Security and server-side role checks    | Planned                       |
| Real-time updates        | Supabase Realtime                                 | Planned                       |
| Unit and component tests | Vitest 5.1.1 with the Playwright browser provider | Installed                     |
| End-to-end tests         | Playwright 1.65.1                                 | Installed                     |
| Linting and formatting   | ESLint 10.15.0 and Prettier 3.10.1                | Installed                     |
| CI/CD                    | GitHub Actions                                    | Planned                       |

Versions are the ones installed in `node_modules` when this document was written.

## Project structure

```text
homebase_final/
├── docs/                        Project documentation
│   ├── adrs/                    Architecture decision records
│   ├── api.md                   Planned API routes
│   ├── database.md              Planned schema, RLS, and functions
│   ├── deployment.md            Deployment, CI, and quality plan
│   ├── setup.md                 Local setup and scripts
│   └── system.md                System architecture and security model
├── src/
│   ├── app.d.ts                 Global SvelteKit type declarations
│   ├── app.html                 HTML shell
│   ├── lib/                     Shared code, imported through the #lib alias
│   │   ├── assets/              Static assets imported by components
│   │   ├── index.ts             Library entry point (currently empty)
│   │   └── vitest-examples/     Starter test examples
│   └── routes/                  Pages and layouts
├── static/                      Files served unchanged (robots.txt)
├── eslint.config.js
├── package.json
├── playwright.config.ts
├── prettier.config.js
├── tsconfig.json
└── vite.config.ts
```

The following directories are planned and do not exist yet:

| Path                 | Purpose                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| `src/lib/server/`    | Server-only modules, such as the Supabase server client and permission helpers |
| `src/routes/api/`    | JSON API endpoints described in `docs/api.md`                                  |
| `supabase/`          | Database migrations and seed data described in `docs/database.md`              |
| `.github/workflows/` | GitHub Actions pipeline described in `docs/deployment.md`                      |

## Getting started

Requirements: Node.js 22.17 or later. The full setup, including environment variables and troubleshooting, is in [docs/setup.md](docs/setup.md).

```sh
npm install
npm run dev
```

Open the local address printed in the terminal (typically `http://localhost:5173`). You should see the default SvelteKit welcome page.

## Scripts

| Command             | What it does                                                         |
| ------------------- | -------------------------------------------------------------------- |
| `npm run dev`       | Starts the development server                                        |
| `npm run build`     | Creates a production build with the Vercel adapter                   |
| `npm run preview`   | Serves the production build locally                                  |
| `npm run check`     | Syncs generated SvelteKit types and runs `svelte-check`              |
| `npm run lint`      | Checks Prettier formatting and runs ESLint                           |
| `npm run format`    | Formats the project with Prettier                                    |
| `npm run test:unit` | Runs Vitest (watch mode by default; add `-- --run` for a single run) |
| `npm run test:e2e`  | Installs Playwright browsers and runs the end-to-end tests           |
| `npm test`          | Runs the unit tests once, then the end-to-end tests                  |

## Documentation

| Document                                                                           | Contents                                                               |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [docs/setup.md](docs/setup.md)                                                     | Prerequisites, installation, environment variables, and known issues   |
| [docs/system.md](docs/system.md)                                                   | Architecture, request flows, security boundaries, and role permissions |
| [docs/api.md](docs/api.md)                                                         | Planned API routes, payloads, error codes, and status codes            |
| [docs/database.md](docs/database.md)                                               | Planned PostgreSQL schema, constraints, RLS policies, and functions    |
| [docs/deployment.md](docs/deployment.md)                                           | Vercel, Supabase, GitHub Actions, testing, and accessibility plans     |
| [docs/adrs/001-sveltekit.md](docs/adrs/001-sveltekit.md)                           | Decision to use SvelteKit                                              |
| [docs/adrs/002-supabase.md](docs/adrs/002-supabase.md)                             | Decision to use Supabase PostgreSQL and Supabase Auth                  |
| [docs/adrs/003-points-and-invitations.md](docs/adrs/003-points-and-invitations.md) | Decisions for automatic points and invitation codes                    |
