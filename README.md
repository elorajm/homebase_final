# HomeBase

HomeBase is a household management web application. Household members share chores, grocery lists, a calendar, and expenses in one place. Completed chores earn points, and each household has a leaderboard built from those points.

HomeBase is the final project for WDD 430, developed by a two-person team.

> **Project status: frontend preview.** The SvelteKit interface for every planned area is built and runs on typed sample data. Nothing you enter is saved. Authentication, the database, and real-time updates are **not implemented yet**. The `docs/` folder describes the planned design.

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

| Area                                                                                                             | Status                                                                   |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| SvelteKit project with strict TypeScript and Tailwind CSS (forms plugin)                                         | Implemented                                                              |
| Application shell with desktop sidebar, mobile navigation drawer, household switcher, and profile menu           | Implemented (sample data; switcher changes the header label only)        |
| Dashboard, Tasks & Chores, Grocery Lists, Calendar, Expenses, Leaderboard, Household Settings, and Profile pages | Implemented (sample data; forms and toggles change the screen only)      |
| Public authentication pages: sign in, create account, and reset password                                         | Implemented as placeholders. They do not check, create, or send anything |
| Authentication types, validation, and provider interface for the future Supabase integration                     | Prepared. The placeholder provider never signs anyone in                 |
| Route groups for the signed-in application `(app)` and the public authentication pages `(auth)`                  | Implemented; public URLs are unchanged                                   |
| ESLint, Prettier, Vitest (server and browser projects), and Playwright end-to-end tests                          | Implemented                                                              |
| Vercel adapter (`@sveltejs/adapter-vercel`) in `vite.config.ts`                                                  | Implemented; no Vercel deployment exists yet                             |
| Project documentation in `docs/`                                                                                 | Implemented                                                              |
| Real authentication, sessions, and authorization                                                                 | Planned (Supabase Auth)                                                  |
| Database persistence for households, tasks, points, groceries, calendar, and expenses                            | Planned (Supabase PostgreSQL)                                            |
| Real-time synchronization                                                                                        | Planned (Supabase Realtime)                                              |
| Production deployment on Vercel and GitHub Actions CI                                                            | Planned                                                                  |

## Pages

The signed-in application is in the `(app)` route group and uses the sidebar shell. Route groups do not appear in URLs.

| URL            | Page               | Notes                                                                                                              |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `/`            | Redirects          | Sends visitors to `/dashboard`                                                                                     |
| `/dashboard`   | Dashboard          | Welcome message, summary cards, today's tasks, events, groceries, spending, leaderboard preview, and quick actions |
| `/tasks`       | Tasks & Chores     | Filters for All, Mine, Upcoming, and Completed; Add a task form                                                    |
| `/groceries`   | Grocery Lists      | Items grouped by category; Add an item form                                                                        |
| `/calendar`    | Calendar           | Monthly view, task deadlines, event details, and Add an event form                                                 |
| `/expenses`    | Expenses           | Monthly summary, category breakdown, history, and Log an expense form                                              |
| `/leaderboard` | Leaderboard        | Ranking with progress, recent completions, and how points work                                                     |
| `/household`   | Household Settings | Household details, members, and invitation list with revoke                                                        |
| `/profile`     | Profile            | Display name, time zone, households, and password placeholder                                                      |

The public authentication pages are in the `(auth)` route group and use a centered layout without the sidebar.

| URL                | Page           | Notes                                                        |
| ------------------ | -------------- | ------------------------------------------------------------ |
| `/login`           | Sign in        | Email, password, forgot-password link, and registration link |
| `/register`        | Create account | Full name, email, password, and confirmation                 |
| `/forgot-password` | Reset password | Email address and back-to-sign-in link                       |

Every form on these pages validates its input. Each one reports that its action is not connected, and none of them claims that an account was created or an email was sent.

## Technology stack

| Layer                    | Technology                                        | Status                        |
| ------------------------ | ------------------------------------------------- | ----------------------------- |
| Application framework    | SvelteKit 3.4.0                                   | Installed                     |
| UI                       | Svelte 5.58.0 (runes mode)                        | Installed                     |
| Language                 | TypeScript 6.0.3 in strict mode                   | Installed                     |
| Styling                  | Tailwind CSS 4.3.5 with `@tailwindcss/forms`      | Installed                     |
| Icons                    | `@lucide/svelte` 1.76.0                           | Installed                     |
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

Versions are the ones installed in `node_modules` when this document was last updated.

## Project structure

```text
homebase_final/
├── docs/                          Project documentation
│   ├── adrs/                      Architecture decision records
│   ├── api.md                     Planned API routes
│   ├── database.md                Planned schema, RLS, and functions
│   ├── deployment.md              Deployment, CI, and quality plan
│   ├── setup.md                   Local setup and scripts
│   └── system.md                  System architecture and security model
├── src/
│   ├── app.d.ts                   Global SvelteKit type declarations
│   ├── app.html                   HTML shell
│   ├── lib/                       Shared code, imported through the #lib alias
│   │   ├── assets/                Static assets (favicon)
│   │   ├── auth/                  Authentication types, validation, messages, and placeholder provider
│   │   ├── components/
│   │   │   ├── auth/              Sign-in, registration, and password-reset forms and the auth card
│   │   │   ├── shell/             Sidebar, mobile navigation, household switcher, profile menu
│   │   │   ├── ui/                Buttons, cards, badges, form fields, page headers, and shared styles
│   │   │   ├── tasks/             Task cards, filters, and the Add a task form
│   │   │   ├── groceries/         Grocery groups and the Add an item form
│   │   │   ├── calendar/          Month calendar, event cards, and the Add an event form
│   │   │   ├── expenses/          Category breakdown, expense history, and the Log an expense form
│   │   │   ├── leaderboard/       Ranking cards
│   │   │   └── household/         Member list and invitation panel
│   │   ├── domain/                Pure logic: dates, money, tasks, points, expenses, calendar, invitations
│   │   ├── mock/                  Typed sample data used by the preview
│   │   ├── navigation.ts          Primary navigation items and current-page matching
│   │   └── routes.ts              Typed route IDs for the (app) and (auth) groups
│   └── routes/
│       ├── +layout.svelte         Root layout: global stylesheet and favicon only
│       ├── +page.ts               Redirect from / to /dashboard
│       ├── layout.css             Tailwind theme, design tokens, and base styles
│       ├── (app)/                 Signed-in application (sidebar shell)
│       │   ├── +layout.svelte     Application shell
│       │   ├── +layout.ts         Sample data for the shell
│       │   └── dashboard/, tasks/, groceries/, calendar/, expenses/,
│       │       leaderboard/, household/, profile/
│       ├── (auth)/                Public authentication pages (centered layout)
│       │   ├── +layout.svelte     Public layout
│       │   └── login/, register/, forgot-password/
│       ├── navigation.e2e.ts      End-to-end tests for every page and the navigation
│       ├── auth.e2e.ts            End-to-end tests for the authentication pages
│       └── page.svelte.e2e.ts     Smoke test for the home page
├── static/                        Files served unchanged (robots.txt)
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

Open the local address printed in the terminal (typically `http://localhost:5173`). The home page redirects to the dashboard, which shows sample household data. To see the public pages, open `/login`.

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

| Document                                                                                                 | Contents                                                                             |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [docs/setup.md](docs/setup.md)                                                                           | Prerequisites, installation, environment variables, and known issues                 |
| [docs/system.md](docs/system.md)                                                                         | Architecture, route groups, request flows, security boundaries, and role permissions |
| [docs/api.md](docs/api.md)                                                                               | Planned API routes, payloads, error codes, and status codes                          |
| [docs/database.md](docs/database.md)                                                                     | Planned PostgreSQL schema, constraints, RLS policies, and functions                  |
| [docs/deployment.md](docs/deployment.md)                                                                 | Vercel, Supabase, GitHub Actions, testing, and accessibility plans                   |
| [docs/adrs/001-sveltekit.md](docs/adrs/001-sveltekit.md)                                                 | Decision to use SvelteKit                                                            |
| [docs/adrs/002-supabase.md](docs/adrs/002-supabase.md)                                                   | Decision to use Supabase PostgreSQL and Supabase Auth                                |
| [docs/adrs/003-points-and-invitations.md](docs/adrs/003-points-and-invitations.md)                       | Decisions for automatic points and invitation codes                                  |
| [docs/adrs/004-route-groups-and-auth-preparation.md](docs/adrs/004-route-groups-and-auth-preparation.md) | Route groups, typed route IDs, and the authentication seam                           |
