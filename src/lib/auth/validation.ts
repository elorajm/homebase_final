/**
 * Input validation for the authentication forms. These checks only shape what the user sees.
 * They are not authorization, and the server must repeat them when Supabase is connected.
 */

/** Minimum password length. Matches the rule planned for the Supabase password policy. */
export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an error message for an invalid email address, or `undefined` when it is valid. */
export function validateEmail(value: string): string | undefined {
	const email = value.trim();
	if (email.length === 0) return 'Enter your email address.';
	if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
		return 'Enter an email address, such as name@example.com.';
	}
	return undefined;
}

/** Returns an error message for a missing sign-in password, or `undefined` when one is present. */
export function validateSignInPassword(value: string): string | undefined {
	return value.length === 0 ? 'Enter your password.' : undefined;
}

/** Returns an error message for a new password that is too short, or `undefined` when it is long enough. */
export function validateNewPassword(value: string): string | undefined {
	if (value.length < MIN_PASSWORD_LENGTH) {
		return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
	}
	if (value.length > 128) return 'Use 128 characters or fewer.';
	return undefined;
}

/** Returns an error message when the confirmation does not match the password. */
export function validatePasswordConfirmation(
	password: string,
	confirmation: string
): string | undefined {
	return password === confirmation ? undefined : 'The passwords do not match.';
}

/** Returns an error message for a full name, or `undefined` when it is valid. */
export function validateFullName(value: string): string | undefined {
	const name = value.trim();
	if (name.length === 0) return 'Enter your full name.';
	if (name.length > 80) return 'Names can be up to 80 characters.';
	return undefined;
}
