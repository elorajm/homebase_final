import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { placeholderAuthProvider } from '#lib/auth/provider';
import type { AuthProvider, AuthResult } from '#lib/auth/types';
import ForgotPasswordForm from './ForgotPasswordForm.svelte';

function spyRequestReset() {
	return vi.fn<(email: string) => Promise<AuthResult>>(() =>
		Promise.resolve({ status: 'not-connected' })
	);
}

describe('ForgotPasswordForm', () => {
	it('asks for an email address and reports an invalid one', async () => {
		const requestPasswordReset = spyRequestReset();
		const provider: AuthProvider = { ...placeholderAuthProvider, requestPasswordReset };
		await render(ForgotPasswordForm, { provider });

		await page.getByLabelText('Email address').fill('not-an-address');
		await page.getByRole('button', { name: 'Reset password' }).click();

		await expect
			.element(page.getByText('Enter an email address, such as name@example.com.'))
			.toBeVisible();
		expect(requestPasswordReset).not.toHaveBeenCalled();
	});

	it('says no email was sent while password reset is not connected', async () => {
		const requestPasswordReset = spyRequestReset();
		const provider: AuthProvider = { ...placeholderAuthProvider, requestPasswordReset };
		await render(ForgotPasswordForm, { provider });

		await page.getByLabelText('Email address').fill('sam.rivera@example.com');
		await page.getByRole('button', { name: 'Reset password' }).click();

		expect(requestPasswordReset).toHaveBeenCalledWith('sam.rivera@example.com');
		await expect.element(page.getByText('No email was sent.', { exact: false })).toBeVisible();
	});
});
