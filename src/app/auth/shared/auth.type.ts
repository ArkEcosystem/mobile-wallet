export enum AuthMethod {
	Pin,
	TouchID,
	FaceID,
}

export interface AuthRequestOptions {
	message: string;
	outputPassword: boolean;
}

export interface AuthPersistedData {
	attempts: number;
	unlockDate: Date | undefined;
}

export interface AuthStateModel extends AuthPersistedData {
	isPending: boolean;
	method: AuthMethod | undefined;
}
