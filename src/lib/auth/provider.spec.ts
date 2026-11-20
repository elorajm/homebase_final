import { describe, expect, it } from 'vitest';
import { placeholderAuthProvider } from './provider';

describe('placeholderAuthProvider', () => {
	it('reports not-connected for every action, so nothing looks signed in or created', async () => {
		const results = await Promise.all([
			placeholderAuthProvider.signIn({ email: 'sam@example.com', password: 'example-password' }),
			placeholderAuthProvider.register({
				fullName: 'Sam Rivera',
				email: 'sam@example.com',
				password: 'example-password'
			}),
			placeholderAuthProvider.requestPasswordReset('sam@example.com'),
			placeholderAuthProvider.signOut()
		]);

		expect(results).toEqual([
			{ status: 'not-connected' },
			{ status: 'not-connected' },
			{ status: 'not-connected' },
			{ status: 'not-connected' }
		]);
	});

	it('never reports a signed-in user', async () => {
		expect(await placeholderAuthProvider.getCurrentUser()).toBeNull();
	});
});
