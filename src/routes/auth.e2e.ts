import { expect, test } from '@playwright/test';

const AUTH_PAGES = [
	{ path: '/login', heading: 'Sign in to HomeBase' },
	{ path: '/register', heading: 'Create your account' },
	{ path: '/forgot-password', heading: 'Reset your password' }
];

for (const authPage of AUTH_PAGES) {
	test(`${authPage.path} renders in the public layout`, async ({ page }) => {
		const response = await page.goto(authPage.path);

		expect(response?.status()).toBe(200);
		await expect(page.getByRole('heading', { level: 1, name: authPage.heading })).toBeVisible();
		await expect(page.getByRole('complementary', { name: 'Application sidebar' })).toHaveCount(0);
	});
}

test('the authentication pages link to each other', async ({ page }) => {
	await page.goto('/login');
	await page.getByRole('link', { name: 'Create an account' }).click();
	await expect(page).toHaveURL(/\/register$/);

	await page.getByRole('link', { name: 'Sign in' }).click();
	await expect(page).toHaveURL(/\/login$/);

	await page.getByRole('link', { name: 'Forgot password?' }).click();
	await expect(page).toHaveURL(/\/forgot-password$/);

	await page.getByRole('link', { name: 'Back to sign in' }).click();
	await expect(page).toHaveURL(/\/login$/);
});

test('sign-in validates the form and never signs anyone in', async ({ page }) => {
	await page.goto('/login');

	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page.getByText('Enter your email address.')).toBeVisible();

	await page.getByLabel('Email address').fill('sam.rivera@example.com');
	await page.getByLabel('Password').fill('example-password');
	await page.getByRole('button', { name: 'Sign in' }).click();

	await expect(
		page.getByText('Sign-in is not connected in this preview yet.', { exact: false })
	).toBeVisible();
	await expect(page).toHaveURL(/\/login$/);
});

test('registration reports that no account was created', async ({ page }) => {
	await page.goto('/register');

	await page.getByLabel('Full name').fill('Sam Rivera');
	await page.getByLabel('Email address').fill('sam.rivera@example.com');
	await page.getByLabel('Password', { exact: true }).fill('example-password');
	await page.getByLabel('Confirm password').fill('example-password');
	await page.getByRole('button', { name: 'Create account' }).click();

	await expect(page.getByText('No account was created.', { exact: false })).toBeVisible();
	await expect(page).toHaveURL(/\/register$/);
});

test('password reset reports that no email was sent', async ({ page }) => {
	await page.goto('/forgot-password');

	await page.getByLabel('Email address').fill('sam.rivera@example.com');
	await page.getByRole('button', { name: 'Reset password' }).click();

	await expect(page.getByText('No email was sent.', { exact: false })).toBeVisible();
	await expect(page).toHaveURL(/\/forgot-password$/);
});

test('the sample dashboard keeps the application shell and is still reachable', async ({
	page
}) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/login');

	await page.getByRole('link', { name: 'Browse the sample dashboard without signing in' }).click();

	await expect(page).toHaveURL(/\/dashboard$/);
	await expect(page.getByRole('complementary', { name: 'Application sidebar' })).toBeVisible();
});
