import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { TaskFilter } from '#lib/domain/tasks';
import TaskFilterBar from './TaskFilterBar.svelte';

describe('TaskFilterBar', () => {
	it('marks the active filter and reports the one that is chosen', async () => {
		const onChange = vi.fn<(filter: TaskFilter) => void>();
		await render(TaskFilterBar, {
			filter: 'all',
			counts: { all: 11, mine: 3, upcoming: 8, completed: 2 },
			onChange
		});

		await expect
			.element(page.getByRole('button', { name: /^All/ }))
			.toHaveAttribute('aria-pressed', 'true');
		await expect
			.element(page.getByRole('button', { name: /^Mine/ }))
			.toHaveAttribute('aria-pressed', 'false');

		await page.getByRole('button', { name: /^Mine/ }).click();

		expect(onChange).toHaveBeenCalledWith('mine');
	});
});
