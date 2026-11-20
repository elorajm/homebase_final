import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { placeholderAuthProvider } from '#lib/auth/provider';
import type { AuthProvider, AuthResult, RegisterInput } from '#lib/auth/types';
import RegisterForm from './RegisterForm.svelte';

function providerWithRegister(result: AuthResult) {
	const register = vi.fn<(input: RegisterInput) => Promise<AuthResult>>(() =>
		Promise.resolve(result)
	);
	const provider: AuthProvider = { ...placeholderAuthProvider, register };
	return { provider, register };
}

describe('RegisterForm', () => {
	it('collects the name, email, password, and confirmation', async () => {
		await render(RegisterForm);

		await expect.element(page.getByLabelText('Full name')).toBeVisible();
		await expect.element(page.getByLabelText('Email address')).toBeVisible();
		await expect.element(page.getByLabelText('Password', { exact: true })).toBeVisible();
		await expect.element(page.getByLabelText('Confirm password')).toBeVisible();
		await expect.element(page.getByRole('button', { name: 'Create account' })).toBeVisible();
	});

	it('explains a short password and a mismatched confirmation', async () => {
		const { provider, register } = providerWithRegister({ status: 'not-connected' });
		await render(RegisterForm, { provider });

		await page.getByLabelText('Full name').fill('Sam Rivera');
		await page.getByLabelText('Email address').fill('sam.rivera@example.com');
		await page.getByLabelText('Password', { exact: true }).fill('short');
		await page.getByLabelText('Confirm password').fill('different');
		await page.getByRole('button', { name: 'Create account' }).click();

		await expect.element(page.getByText('Use at least 8 characters.')).toBeVisible();
		await expect.element(page.getByText('The passwords do not match.')).toBeVisible();
		expect(register).not.toHaveBeenCalled();
	});

	it('says no account was created, and does not claim success', async () => {
		const { provider, register } = providerWithRegister({ status: 'not-connected' });
		await render(RegisterForm, { provider });

		await page.getByLabelText('Full name').fill('Sam Rivera');
		await page.getByLabelText('Email address').fill('sam.rivera@example.com');
		await page.getByLabelText('Password', { exact: true }).fill('example-password');
		await page.getByLabelText('Confirm password').fill('example-password');
		await page.getByRole('button', { name: 'Create account' }).click();

		expect(register).toHaveBeenCalledWith({
			fullName: 'Sam Rivera',
			email: 'sam.rivera@example.com',
			password: 'example-password'
		});
		await expect.element(page.getByText('No account was created.', { exact: false })).toBeVisible();
		expect(document.body.textContent).not.toContain('Account created');
	});
});
