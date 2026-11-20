import { describe, expect, it } from 'vitest';
import {
	MIN_PASSWORD_LENGTH,
	validateEmail,
	validateFullName,
	validateNewPassword,
	validatePasswordConfirmation,
	validateSignInPassword
} from './validation';

describe('validateEmail', () => {
	it('accepts a normal address and ignores surrounding spaces', () => {
		expect(validateEmail('  sam.rivera@example.com ')).toBeUndefined();
	});

	it('explains a missing or malformed address', () => {
		expect(validateEmail('   ')).toBe('Enter your email address.');
		expect(validateEmail('sam@example')).toBe('Enter an email address, such as name@example.com.');
		expect(validateEmail('sam example@x.com')).toBe(
			'Enter an email address, such as name@example.com.'
		);
	});
});

describe('password rules', () => {
	it('requires some sign-in password without checking its strength', () => {
		expect(validateSignInPassword('')).toBe('Enter your password.');
		expect(validateSignInPassword('x')).toBeUndefined();
	});

	it('requires a new password of at least the minimum length', () => {
		expect(MIN_PASSWORD_LENGTH).toBe(8);
		expect(validateNewPassword('short')).toBe('Use at least 8 characters.');
		expect(validateNewPassword('a'.repeat(8))).toBeUndefined();
		expect(validateNewPassword('a'.repeat(129))).toBe('Use 128 characters or fewer.');
	});

	it('requires the confirmation to match exactly', () => {
		expect(validatePasswordConfirmation('correct horse', 'correct horse')).toBeUndefined();
		expect(validatePasswordConfirmation('correct horse', 'Correct horse')).toBe(
			'The passwords do not match.'
		);
	});
});

describe('validateFullName', () => {
	it('requires a name and limits its length', () => {
		expect(validateFullName('  ')).toBe('Enter your full name.');
		expect(validateFullName('Sam Rivera')).toBeUndefined();
		expect(validateFullName('a'.repeat(81))).toBe('Names can be up to 80 characters.');
	});
});
