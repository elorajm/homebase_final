import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { placeholderAuthProvider } from '#lib/auth/provider';
import type { AuthProvider, AuthResult, SignInInput } from '#lib/auth/types';
import LoginForm from './LoginForm.svelte';

function spySignIn() {
	return vi.fn<(input: SignInInput) => Promise<AuthResult>>(() =>
		Promise.resolve({ status: 'not-connected' })
	);
}

describe('LoginForm', () => {
	it('labels its fields and links to password reset', async () => {
		await render(LoginForm);

		await expect.element(page.getByLabelText('Email address')).toBeVisible();
		await expect.element(page.getByLabelText('Password')).toHaveAttribute('type', 'password');
		await expect
			.element(page.getByRole('link', { name: 'Forgot password?' }))
			.toHaveAttribute('href', '/forgot-password');
	});

	it('reports missing fields and does not call the provider', async () => {
		const signIn = spySignIn();
		await render(LoginForm, { provider: { ...placeholderAuthProvider, signIn } });

		await page.getByRole('button', { name: 'Sign in' }).click();

		await expect.element(page.getByText('Enter your email address.')).toBeVisible();
		await expect.element(page.getByText('Enter your password.')).toBeVisible();
		expect(signIn).not.toHaveBeenCalled();
	});

	it('says sign-in is not connected instead of implying success', async () => {
		const signIn = spySignIn();
		await render(LoginForm, { provider: { ...placeholderAuthProvider, signIn } });

		await page.getByLabelText('Email address').fill('sam.rivera@example.com');
		await page.getByLabelText('Password').fill('example-password');
		await page.getByRole('button', { name: 'Sign in' }).click();

		expect(signIn).toHaveBeenCalledWith({
			email: 'sam.rivera@example.com',
			password: 'example-password'
		});
		await expect
			.element(page.getByText('Sign-in is not connected in this preview yet.', { exact: false }))
			.toBeVisible();
	});

	it('shows a rejection message from the provider', async () => {
		const provider: AuthProvider = {
			...placeholderAuthProvider,
			signIn: () =>
				Promise.resolve({ status: 'rejected', message: 'Check your email and password.' })
		};
		await render(LoginForm, { provider });

		await page.getByLabelText('Email address').fill('sam.rivera@example.com');
		await page.getByLabelText('Password').fill('example-password');
		await page.getByRole('button', { name: 'Sign in' }).click();

		await expect.element(page.getByText('Check your email and password.')).toBeVisible();
	});
});
