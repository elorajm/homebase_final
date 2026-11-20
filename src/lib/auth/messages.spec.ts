import { describe, expect, it } from 'vitest';
import { AUTH_MESSAGES, describeAuthResult } from './messages';

describe('describeAuthResult', () => {
	it('uses the action message while the provider is not connected', () => {
		expect(describeAuthResult({ status: 'not-connected' }, AUTH_MESSAGES.register)).toBe(
			AUTH_MESSAGES.register
		);
	});

	it('shows the server message for a rejected request', () => {
		expect(describeAuthResult({ status: 'rejected', message: 'Try again later.' }, '')).toBe(
			'Try again later.'
		);
	});

	it('never describes a placeholder action as completed or sent', () => {
		const wording = Object.values(AUTH_MESSAGES).join(' ').toLowerCase();

		expect(wording).not.toMatch(
			/account (has been )?created\b|email (has been )?sent|welcome|you are now signed in/
		);
		expect(AUTH_MESSAGES.register).toContain('No account was created.');
		expect(AUTH_MESSAGES.passwordReset).toContain('No email was sent.');
	});
});
