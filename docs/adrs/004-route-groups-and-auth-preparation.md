# ADR 004: Route groups and the authentication seam

- **Status:** Accepted
- **Date:** 2026-11-20
- **Deciders:** HomeBase team
- **Related:** [ADR 001: SvelteKit](001-sveltekit.md), [ADR 002: Supabase](002-supabase.md), [System architecture](../system.md), [Setup](../setup.md)

## Context

The signed-in application and the public authentication pages need different layouts. The application uses a sidebar shell, and the authentication pages use a centered layout. Both sets of pages must keep their public URLs (`/dashboard`, `/tasks`, `/login`, and the others). The global stylesheet and favicon must apply to both.

Supabase Auth will be connected later. The interface must be ready for it, and it must not depend on it or pretend it exists. Until then, every authentication action has to tell the user what did not happen.

Route IDs are typed. A link that uses `resolve()` is checked against the real routes, which catches broken links during type checking.

## Decision

1. **Route groups separate the layouts.** The root layout (`src/routes/+layout.svelte`) holds only the global stylesheet and the favicon. The `(app)` group holds the signed-in pages behind the application shell. The `(auth)` group holds the public sign-in, registration, and password-reset pages.
2. **Route groups do not change public URLs.** Group names are not part of the path. A test checks that each navigation item and each authentication page still resolves to its existing pathname.
3. **Typed links use route IDs.** `resolve()` accepts route IDs such as `/(app)/tasks`, including hash targets such as `/(app)/tasks#add-task`. Plain pathnames such as `/tasks` are rejected by the type checker, so no type safety is traded away. `src/lib/routes.ts` defines `AppRoute` and `AuthRoute`, and `publicPathname()` converts an ID into its URL for comparisons with the current page.
4. **The authentication seam is an interface.** `AuthProvider` in `src/lib/auth/types.ts` is the only contract the pages use. The placeholder provider in `src/lib/auth/provider.ts` returns `not-connected` for every action and never reports a signed-in user. The forms accept a `provider` prop, so the Supabase implementation can be injected without changing the pages.
5. **Placeholder results never imply success.** Messages say what did not happen. The results type has a `succeeded` status for the Supabase provider, but the placeholder never returns it.

## Rationale

- Route groups are the SvelteKit mechanism for giving sets of pages different layouts while keeping URLs stable. Each group has its own layout file, so the public pages never load the application shell.
- Using route IDs keeps the type checker responsible for link correctness. Writing pathnames as strings would move that check to manual review.
- An interface with a placeholder implementation lets the UI, its validation, and its tests be finished before the backend exists. Replacing the placeholder is a single change, not a change to every page.
- Keeping `not-connected` as an explicit result, rather than an error, makes the state visible in the UI and in the tests.

## Consequences

**Positive**

- The public and signed-in layouts are independent, which makes the future login guard a change to the `(app)` layout alone.
- Every link is type-checked, and every public URL is covered by a test.
- The Supabase integration has a defined contract to implement.

**Negative or accepted**

- Route IDs include `(app)` and `(auth)` in code. Developers must write `/(app)/tasks`, not `/tasks`, in typed links. The helper and this record explain why.
- The `(app)` pages are reachable without signing in until authentication is implemented. The preview is clearly labeled, and the limitation is recorded in [system.md](../system.md#8-known-limitations).
- Validation runs in the browser only. It shapes what the user sees and is not authorization. The server must repeat every check when Supabase is connected.

## Alternatives considered

- **One layout with conditional rendering.** Showing or hiding the sidebar based on the URL would mix two layouts in one file and make the future login guard harder to reason about.
- **A separate SvelteKit application for the authentication pages.** This would add deployment and configuration complexity without a benefit for a single application.
- **Plain pathnames in links.** This is simpler to write, but the type checker would no longer catch broken links. It was rejected in favor of type safety.

## Review

Revisit this decision when the Supabase integration begins. At that point the `(app)` layout should gain a session check, and the placeholder provider should be replaced. The route IDs in `src/lib/routes.ts` will need to change only if a route is added, moved, or renamed.
