<script lang="ts">
	import { TASK_FILTERS, TASK_FILTER_LABELS, type TaskFilter } from '#lib/domain/tasks';

	interface Props {
		filter: TaskFilter;
		counts: Record<TaskFilter, number>;
		onChange: (filter: TaskFilter) => void;
	}

	let { filter, counts, onChange }: Props = $props();
</script>

<div role="group" aria-label="Filter tasks" class="flex flex-wrap gap-2">
	{#each TASK_FILTERS as option (option)}
		<button
			type="button"
			aria-pressed={filter === option}
			onclick={() => onChange(option)}
			class="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors {filter ===
			option
				? 'border-sage-700 bg-sage-700 text-white'
				: 'border-stone-300 bg-white text-stone-800 hover:bg-stone-50'}"
		>
			{TASK_FILTER_LABELS[option]}
			<span
				class="rounded-full px-2 py-0.5 text-xs {filter === option
					? 'bg-white/20'
					: 'bg-stone-100 text-stone-700'}"
			>
				{counts[option]}
				<span class="sr-only">tasks</span>
			</span>
		</button>
	{/each}
</div>
