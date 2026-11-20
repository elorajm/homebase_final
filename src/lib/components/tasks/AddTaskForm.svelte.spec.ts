import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { SAMPLE_MEMBERS } from '#lib/mock/sample-data';
import type { TaskDraft } from '#lib/domain/drafts';
import AddTaskForm from './AddTaskForm.svelte';

describe('AddTaskForm', () => {
	it('explains what is missing instead of adding an incomplete task', async () => {
		const onAdd = vi.fn<(draft: TaskDraft) => void>();
		await render(AddTaskForm, { members: SAMPLE_MEMBERS, onAdd });

		await page.getByRole('button', { name: 'Add task' }).click();

		await expect.element(page.getByText('Enter a title for the task.')).toBeVisible();
		await expect.element(page.getByLabelText('Task title')).toHaveAttribute('aria-invalid', 'true');
		expect(onAdd).not.toHaveBeenCalled();
	});

	it('adds a valid task and states that nothing was saved', async () => {
		const onAdd = vi.fn<(draft: TaskDraft) => void>();
		await render(AddTaskForm, { members: SAMPLE_MEMBERS, onAdd });

		await page.getByLabelText('Task title').fill('Sweep the porch');
		await page.getByLabelText('Due date').fill('2026-11-27');
		await page.getByRole('button', { name: 'Add task' }).click();

		expect(onAdd).toHaveBeenCalledTimes(1);
		expect(onAdd.mock.calls[0]?.[0]).toMatchObject({
			title: 'Sweep the porch',
			dueDate: '2026-11-27',
			pointsValue: 5,
			assigneeId: null
		});
		await expect
			.element(page.getByText('Task added to this preview. It is not saved.'))
			.toBeVisible();
	});
});
