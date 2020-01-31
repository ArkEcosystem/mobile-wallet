import { AuthMethod } from "./auth.type";

export namespace AuthActions {
	export class Request {
		static readonly type = "[Auth] Request";
		constructor() {}
	}

	export class SetMethod {
		static readonly type = "[Auth] SetMethod";
		constructor(public method: AuthMethod) {}
	}
}
