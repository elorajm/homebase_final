import type { AuthProvider, AuthResult } from './types';

/**
 * The placeholder provider used until Supabase Auth is connected.
 *
 * It never checks credentials, never stores a password, and never reports a signed-in user.
 * Every action returns `not-connected`, so the UI can say plainly that nothing happened.
 */
function notConnected(): Promise<AuthResult> {
	return Promise.resolve({ status: 'not-connected' });
}

export const placeholderAuthProvider: AuthProvider = {
	signIn: notConnected,
	register: notConnected,
	requestPasswordReset: notConnected,
	signOut: notConnected,
	getCurrentUser: () => Promise.resolve(null)
};
