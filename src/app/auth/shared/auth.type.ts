export enum AuthMethod {
	Pin,
	TouchID,
	FaceID,
}

export interface AuthRequestOptions {
	withPassword: boolean;
}

export interface AuthStateModel {
	isPending: boolean;
	method: AuthMethod | undefined;
}
