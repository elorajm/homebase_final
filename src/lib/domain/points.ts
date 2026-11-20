import type { LeaderboardEntry, Member, PointTransaction } from './types';

/**
 * Derives each member's total from the point transactions, following the
 * ledger design in docs/database.md. Members with no transactions appear with zero.
 * Ties share a rank, and the next rank skips the tied positions (1, 2, 2, 4).
 */
export function computeLeaderboard(
	members: readonly Member[],
	transactions: readonly PointTransaction[]
): LeaderboardEntry[] {
	const totals = new Map<string, number>();
	for (const transaction of transactions) {
		totals.set(transaction.memberId, (totals.get(transaction.memberId) ?? 0) + transaction.points);
	}

	const sorted = members
		.map((member) => ({
			memberId: member.id,
			displayName: member.displayName,
			avatarTone: member.avatarTone,
			points: totals.get(member.id) ?? 0
		}))
		.sort((a, b) => b.points - a.points || a.displayName.localeCompare(b.displayName));

	let previousPoints: number | null = null;
	let previousRank = 0;
	return sorted.map((entry, index) => {
		const rank = entry.points === previousPoints ? previousRank : index + 1;
		previousPoints = entry.points;
		previousRank = rank;
		return { rank, ...entry };
	});
}

/** Returns award transactions (positive points), newest first. Reversals are excluded. */
export function recentCompletions(
	transactions: readonly PointTransaction[],
	limit: number
): PointTransaction[] {
	return transactions
		.filter((transaction) => transaction.points > 0)
		.sort((a, b) => (a.occurredOn === b.occurredOn ? 0 : a.occurredOn < b.occurredOn ? 1 : -1))
		.slice(0, limit);
}
