import { describe, expect, it } from 'vitest';
import { SAMPLE_MEMBERS, SAMPLE_POINT_TRANSACTIONS } from '#lib/mock/sample-data';
import type { Member } from './types';
import { computeLeaderboard, recentCompletions } from './points';

describe('computeLeaderboard', () => {
	it('ranks sample members by the sum of their point transactions', () => {
		const board = computeLeaderboard(SAMPLE_MEMBERS, SAMPLE_POINT_TRANSACTIONS);

		expect(board.map((entry) => [entry.displayName, entry.points, entry.rank])).toEqual([
			['Alex Rivera', 23, 1],
			['Jordan Rivera', 20, 2],
			['Sam Rivera', 15, 3],
			['Riley Rivera', 7, 4]
		]);
	});

	it('includes members with no transactions and shares ranks on ties', () => {
		const members: Member[] = [
			{ id: 'a', displayName: 'Ada', role: 'member', avatarTone: 'sage' },
			{ id: 'b', displayName: 'Ben', role: 'member', avatarTone: 'mist' },
			{ id: 'c', displayName: 'Cy', role: 'member', avatarTone: 'stone' },
			{ id: 'd', displayName: 'Dee', role: 'member', avatarTone: 'apricot' }
		];
		const transactions = [
			{ id: '1', memberId: 'a', points: 10, taskTitle: 'x', occurredOn: '2026-11-01' },
			{ id: '2', memberId: 'b', points: 10, taskTitle: 'y', occurredOn: '2026-11-01' },
			{ id: '3', memberId: 'c', points: 5, taskTitle: 'z', occurredOn: '2026-11-01' }
		];

		const board = computeLeaderboard(members, transactions);

		expect(board.map((entry) => entry.rank)).toEqual([1, 1, 3, 4]);
		expect(board.at(-1)).toMatchObject({ displayName: 'Dee', points: 0 });
	});
});

describe('recentCompletions', () => {
	it('excludes reversals and returns the newest awards first', () => {
		const recent = recentCompletions(SAMPLE_POINT_TRANSACTIONS, 3);

		expect(recent.map((transaction) => transaction.id)).toEqual(['pt-02', 'pt-03', 'pt-06']);
		expect(recent.every((transaction) => transaction.points > 0)).toBe(true);
	});
});
