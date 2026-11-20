/** Shared class names for buttons, so a `<button>` and a link can look the same. */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const BASE =
	'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'bg-sage-700 text-white shadow-sm hover:bg-sage-800',
	secondary: 'border border-sage-200 bg-white text-sage-900 shadow-sm hover:bg-sage-50',
	ghost: 'text-mist-800 hover:bg-mist-50'
};

export function buttonClass(variant: ButtonVariant = 'primary', extra = ''): string {
	return [BASE, VARIANTS[variant], extra].filter(Boolean).join(' ');
}
