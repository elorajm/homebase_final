/**
 * Authentication types for the future Supabase Auth integration.
 *
 * These match the planned `profiles` table in docs/database.md and the profile endpoint in docs/api.md.
 * Nothing here creates a session. The placeholder provider in `provider.ts` never reports a signed-in user.
 */

/** The signed-in user, as the application will see it once Supabase Auth is connected. */
export interface AuthUser {
	id: string;
	email: string;
	displayName: string;
}

/** A row from the planned `profiles` table, using the camelCase names of docs/api.md. */
export interface Profile {
	id: string;
	displayName: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Outcome of an authentication action.
 * - `not-connected`: the placeholder provider is active, so no account was checked or created.
 * - `rejected`: the server refused the request, with a message that is safe to show.
 * - `succeeded`: reserved for the Supabase provider. The placeholder never returns it.
 */
export type AuthResult =
	{ status: 'not-connected' } | { status: 'rejected'; message: string } | { status: 'succeeded' };

export interface SignInInput {
	email: string;
	password: string;
}

export interface RegisterInput {
	fullName: string;
	email: string;
	password: string;
}

/**
 * The boundary between the UI and the authentication backend.
 * Pages call only this interface, so the Supabase implementation can replace the placeholder
 * without changing any page.
 */
export interface AuthProvider {
	signIn(input: SignInInput): Promise<AuthResult>;
	register(input: RegisterInput): Promise<AuthResult>;
	requestPasswordReset(email: string): Promise<AuthResult>;
	signOut(): Promise<AuthResult>;
	getCurrentUser(): Promise<AuthUser | null>;
}
