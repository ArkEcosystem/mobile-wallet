export enum AuthMethod {
	Pin,
	TouchID,
	FaceID,
}

export interface AuthStateModel {
	isPending: boolean;
	method: AuthMethod | undefined;
}
