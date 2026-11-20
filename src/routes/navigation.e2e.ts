import { expect, test } from '@playwright/test';

/** Each page must return 200 and show its own heading. */
const ROUTES = [
	{ path: '/dashboard', heading: 'Welcome back, Sam' },
	{ path: '/tasks', heading: 'Tasks & Chores' },
	{ path: '/groceries', heading: 'Grocery Lists' },
	{ path: '/calendar', heading: 'Household Calendar' },
	{ path: '/expenses', heading: 'Expenses' },
	{ path: '/leaderboard', heading: 'Leaderboard' },
	{ path: '/household', heading: 'Household Settings' },
	{ path: '/profile', heading: 'Your Profile' }
];

for (const route of ROUTES) {
	test(`${route.path} renders its heading`, async ({ page }) => {
		const response = await page.goto(route.path);

		expect(response?.status()).toBe(200);
		await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
	});
}

test('the home page redirects to the dashboard', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveURL(/\/dashboard$/);
});

test('desktop sidebar links navigate between pages', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/dashboard');

	await page
		.getByRole('complementary', { name: 'Application sidebar' })
		.getByRole('link', { name: 'Tasks & Chores' })
		.click();

	await expect(page).toHaveURL(/\/tasks$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tasks & Chores');
});

test('the mobile menu opens, navigates, and closes', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/dashboard');

	await page.getByRole('button', { name: 'Open navigation menu' }).click();
	const menu = page.getByRole('dialog', { name: 'Navigation menu' });
	await expect(menu).toBeVisible();

	await menu.getByRole('link', { name: 'Calendar' }).click();

	await expect(page).toHaveURL(/\/calendar$/);
	await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeHidden();
});

test('the mobile menu closes with Escape and returns focus to its button', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/dashboard');

	const openButton = page.getByRole('button', { name: 'Open navigation menu' });
	await openButton.click();
	await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible();

	await page.keyboard.press('Escape');

	await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeHidden();
	await expect(openButton).toBeFocused();
});

test('the add-task form reports a missing title without saving', async ({ page }) => {
	await page.goto('/tasks');

	await page.getByRole('button', { name: 'Add task' }).click();

	await expect(page.getByText('Enter a title for the task.')).toBeVisible();
});
