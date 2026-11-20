# ADR 001: Use SvelteKit as the application framework

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** HomeBase team
- **Related:** [ADR 002: Supabase](002-supabase.md), [ADR 003: Points and invitations](003-points-and-invitations.md), [System architecture](../system.md)

## Context

HomeBase needs several things from its application framework:

- Server-rendered pages for authenticated dashboards.
- JSON API routes that validate input and enforce household roles on the server.
- Live updates to shared tasks, grocery lists, and leaderboards.
- Responsive, accessible forms and layouts.
- Strict TypeScript, unit and component tests, and end-to-end tests.
- Deployment to Vercel.

The team is two people building within a course timeline. The framework should keep the number of moving parts small and avoid spreading the application across several services.

## Decision

Use **SvelteKit** with Svelte 5 (runes mode), strict TypeScript, Vite, Tailwind CSS, and `@sveltejs/adapter-vercel`. SvelteKit serves the pages and the API routes from one project.

## Rationale

1. **One project for pages and API.** Page loads (`+page.server.ts`), form actions, and API endpoints (`+server.ts`) share one codebase, language, and type system. Types such as `Task` or `HouseholdRole` are shared between server and client without a separate API client or code generation step.
2. **Server-only code is enforced.** Modules under `$lib/server` cannot be imported by client code, and SvelteKit fails the build if they are. This supports the requirement that permission checks and secrets stay on the server.
3. **A clear place for session handling.** `hooks.server.ts` runs on every request, which is where the Supabase server client is created and the session is verified. The approach is described in [system.md, section 4.1](../system.md#41-server-rendered-page-load).
4. **Small client bundles.** Svelte compiles components to targeted JavaScript without a virtual DOM runtime. This helps meet the Lighthouse performance target in [deployment.md](../deployment.md#6-performance-targets), though the target has not been measured yet.
5. **Readable reactivity.** Runes (`$state`, `$derived`, `$effect`) make it straightforward to update dashboard views when real-time events arrive.
6. **Vercel support.** `@sveltejs/adapter-vercel` is installed. Its use is confirmed by the build log in this repository, which reports `Using @sveltejs/adapter-vercel`.
7. **Tooling already configured.** The starter includes Tailwind CSS with the forms plugin, ESLint, Prettier, Vitest (with browser mode), and Playwright.

## Consequences

**Positive**

- One deployable unit. There is no separate backend service to host, monitor, or secure.
- Generated route types (`./$types`) make `load` function data and page props type-checked.
- A small team can cover the whole stack without context switching between languages.

**Negative or accepted**

- The Svelte ecosystem has fewer third-party component libraries than React's. The team may write more UI primitives itself.
- Developers familiar with Svelte 4 must learn the rune-based syntax.
- API routes are SvelteKit endpoints. Non-web clients can call them, but the project does not design for that use.
- The adapter is configured in `vite.config.ts` through the `sveltekit()` plugin. The repository has no `svelte.config.js`. This is a supported setup, but it differs from the most common SvelteKit layout, so new developers should be told about it.

## Risks and mitigations

| Risk                                                                                     | Likelihood | Impact | Mitigation                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SvelteKit 3 is a recent major version. Breaking changes or fewer examples may slow work. | Medium     | Medium | Keep versions locked in `package-lock.json`. Read release notes before upgrading. Keep routing and adapter configuration in one place.                                                           |
| The Vercel adapter's build fails on Windows with `EPERM` when creating symlinks.         | Observed   | Medium | Cause identified: the adapter creates directory symlinks. Options are in [setup.md, section 10.1](../setup.md#101-windows-symlink-error-during-production-build). No option has been chosen yet. |
| Svelte 5 runes are unfamiliar to some team members.                                      | Medium     | Low    | Share conventions in [setup.md](../setup.md#9-code-conventions). Review code together in pull requests.                                                                                          |
| The Supabase server integration depends on framework APIs that change between versions.  | Medium     | Medium | Follow the current `@supabase/ssr` SvelteKit guidance. Write an authentication integration test early.                                                                                           |
| Real-time subscriptions need custom client code.                                         | Low        | Medium | Keep subscriptions in one module that the pages use, so the logic is written and tested once.                                                                                                    |

## Alternatives considered

Two alternatives were reviewed against the requirements above. The assessment is qualitative. It is based on how each framework's model fits this application, not on measurements.

| Criterion                                     | SvelteKit (chosen) | Next.js (App Router)                                              | Astro                                                   |
| --------------------------------------------- | ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------- |
| Fit for authenticated, interactive dashboards | Strong             | Strong                                                            | Weaker. Built around mostly static pages with islands.  |
| Server routes and server-only code            | Built in           | Built in, with Server and Client Component rules                  | Endpoints exist, but are secondary to the content model |
| Learning rules for new developers             | Moderate           | Higher. Server and client component boundaries and caching rules. | Moderate                                                |
| Client JavaScript for interactive pages       | Compiled, targeted | React runtime plus framework code                                 | Minimal by default, more work for live UI               |
| Ecosystem size                                | Smaller            | Largest                                                           | Medium                                                  |
| Vercel integration                            | Adapter-based      | Native                                                            | Adapter-based                                           |

### Next.js

Next.js is a mature choice with the largest ecosystem and the tightest Vercel integration. It would have been a reasonable selection. The team preferred SvelteKit for its simpler server and client model and its smaller client runtime, and because the App Router's caching and component rules add concepts that would need to be taught and understood before the first feature could be built.

### Astro

Astro is well suited to content-focused sites that ship little JavaScript. HomeBase is mostly authenticated and interactive. Its pages would be many islands sharing state, which is more complicated than the single application model SvelteKit provides.

## Evaluation method

No benchmark runs, timing measurements, or numeric scores were recorded for this decision. The comparison above is a qualitative review against the project requirements. If the team ran a formal evaluation, its raw results and methodology should be attached to this record, with the date and tool versions.

## Review

Revisit this decision if the framework blocks a core requirement that cannot be resolved within the project timeline, such as authentication or real-time updates on Vercel.
