import type { AuthResult } from './types';

/**
 * User-facing wording for authentication results while the placeholder provider is active.
 * Each message says what did not happen, so nothing suggests an account was created or an email was sent.
 */
export const AUTH_MESSAGES = {
	signIn:
		'Sign-in is not connected in this preview yet. No account was checked, and you are not signed in.',
	register: 'Account creation is not connected in this preview yet. No account was created.',
	passwordReset: 'Password reset is not connected in this preview yet. No email was sent.',
	received: 'Your request was received.'
} as const;

/** Turns an authentication result into the message shown under the form. */
export function describeAuthResult(result: AuthResult, message: string): string {
	switch (result.status) {
		case 'not-connected':
			return message;
		case 'rejected':
			return result.message;
		case 'succeeded':
			return AUTH_MESSAGES.received;
	}
}
