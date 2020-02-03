export enum AuthMethod {
	Pin,
	TouchID,
	FaceID,
}

export interface AuthRequestOptions {
	message: string;
	outputPassword: boolean;
}

export interface AuthStateModel {
	attempts: number;
	isPending: boolean;
	method: AuthMethod | undefined;
}
