export enum AuthMode {
	Authorization,
	Confirmation,
	Registration,
}

export enum AuthMethod {
	Pin,
	TouchID,
}

export namespace AuthConfig {
	export const STORAGE_MASTERPASSWORD = "masterpassword";
	export const STORAGE_KEY = "auth";

	export const ATTEMPTS_LIMIT = 3;
	export const ATTEMPTS_TIMEOUT_SECONDS = 30;

	export const WEAK_PASSWORDS = [
		"000000",
		"111111",
		"222222",
		"333333",
		"444444",
		"555555",
		"666666",
		"777777",
		"888888",
		"999999",
		"012345",
		"123456",
		"234567",
		"345678",
		"456789",
		"567890",
		"543210",
		"654321",
		"765432",
		"876543",
		"987654",
		"098765",
	];
}
