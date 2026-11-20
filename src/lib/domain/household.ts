import type { Invitation, InvitationStatus, IsoDate } from './types';

/**
 * Derives an invitation's status from its stored fields. A revoked invitation stays
 * revoked even if it has not expired. Expiry is checked against `today`.
 */
export function invitationStatus(invitation: Invitation, today: IsoDate): InvitationStatus {
	if (invitation.revokedOn !== null) return 'revoked';
	if (invitation.expiresOn < today) return 'expired';
	if (invitation.useCount >= invitation.maxUses) return 'exhausted';
	return 'active';
}
