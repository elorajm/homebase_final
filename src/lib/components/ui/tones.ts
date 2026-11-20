import type { AvatarTone, TaskPriority } from '#lib/domain/types';

/** Background and text classes for each tone. Pairs keep text contrast above WCAG AA. */
export const TONE_CLASSES: Record<AvatarTone, string> = {
	sage: 'bg-sage-200 text-sage-900',
	mist: 'bg-mist-200 text-mist-900',
	apricot: 'bg-apricot-200 text-apricot-900',
	stone: 'bg-stone-200 text-stone-900'
};

export const PRIORITY_CLASSES: Record<TaskPriority, string> = {
	high: 'bg-apricot-100 text-apricot-800 ring-apricot-300',
	medium: 'bg-mist-100 text-mist-800 ring-mist-300',
	low: 'bg-sage-100 text-sage-800 ring-sage-300'
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
	high: 'High priority',
	medium: 'Medium priority',
	low: 'Low priority'
};
