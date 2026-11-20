/** Shared classes for form controls. Invalid fields use `aria-invalid` so they style the same way everywhere. */

export const INPUT_CLASS =
	'block w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-sm placeholder:text-stone-500 focus:border-mist-500 focus:ring-2 focus:ring-mist-200 focus:outline-none aria-[invalid=true]:border-apricot-600 aria-[invalid=true]:ring-apricot-100';

export const CHECKBOX_CLASS =
	'h-5 w-5 rounded border-stone-400 text-sage-700 focus:ring-2 focus:ring-mist-200 focus:ring-offset-0';
