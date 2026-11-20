import { describe, expect, it } from 'vitest';
import { SAMPLE_INVITATIONS, SAMPLE_TODAY } from '#lib/mock/sample-data';
import { invitationStatus } from './household';

const invitationById = (id: string) => {
	const invitation = SAMPLE_INVITATIONS.find((item) => item.id === id);
	if (!invitation) throw new Error(`Missing sample invitation ${id}`);
	return invitation;
};

describe('invitationStatus', () => {
	it('reports each sample invitation status from its stored fields', () => {
		expect(invitationStatus(invitationById('invitation-1'), SAMPLE_TODAY)).toBe('active');
		expect(invitationStatus(invitationById('invitation-2'), SAMPLE_TODAY)).toBe('revoked');
		expect(invitationStatus(invitationById('invitation-3'), SAMPLE_TODAY)).toBe('exhausted');
		expect(invitationStatus(invitationById('invitation-4'), SAMPLE_TODAY)).toBe('expired');
	});

	it('keeps a revoked invitation revoked even after it expires', () => {
		const revoked = { ...invitationById('invitation-2'), expiresOn: '2026-01-01' };

		expect(invitationStatus(revoked, SAMPLE_TODAY)).toBe('revoked');
	});
});
