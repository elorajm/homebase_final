import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { SAMPLE_HOUSEHOLDS } from '#lib/mock/sample-data';
import MobileNav from './MobileNav.svelte';

function renderMenu(open: boolean, onClose = vi.fn<() => void>()) {
	return render(MobileNav, {
		open,
		onClose,
		households: SAMPLE_HOUSEHOLDS,
		activeHouseholdId: 'household-rivera',
		onSelect: vi.fn<(householdId: string) => void>(),
		note: 'Pages show sample data for Rivera House.',
		currentPath: '/tasks'
	});
}

describe('MobileNav', () => {
	it('renders no dialog while closed', async () => {
		await renderMenu(false);

		expect(document.querySelector('[role="dialog"]')).toBeNull();
	});

	it('lists every page and marks the page being viewed', async () => {
		await renderMenu(true);
		const dialog = page.getByRole('dialog', { name: 'Navigation menu' });

		await expect.element(dialog).toBeVisible();
		await expect
			.element(dialog.getByRole('link', { name: 'Tasks & Chores' }))
			.toHaveAttribute('aria-current', 'page');
		await expect.element(dialog.getByRole('link', { name: 'Calendar' })).toBeVisible();
		await expect.element(dialog.getByRole('link', { name: 'Household Settings' })).toBeVisible();
		expect(dialog.getByRole('link').elements()).toHaveLength(8);
	});

	it('closes when Escape is pressed', async () => {
		const onClose = vi.fn<() => void>();
		await renderMenu(true, onClose);

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('closes from its close button', async () => {
		const onClose = vi.fn<() => void>();
		await renderMenu(true, onClose);

		await page.getByRole('button', { name: 'Close navigation menu' }).click();

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
