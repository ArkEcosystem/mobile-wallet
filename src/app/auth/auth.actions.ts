import { AuthMode } from "./auth.config";

export namespace AuthActions {
	export class Open {
		static readonly type = "[Auth] Open";
		constructor(public payload: { mode: AuthMode }) {}
	}

	export class Cancel {
		static readonly type = "[Auth] Cancel";
		constructor() {}
	}

	export class Fail {
		static readonly type = "[Auth] Fail";
		constructor() {}
	}

	export class Success {
		static readonly type = "[Auth] Success";
		constructor(public password: string) {}
	}

	export class ValidatePassword {
		static readonly type = "[Auth] Validate Password";
		constructor(public password: string) {}
	}

	export class SetPassword {
		static readonly type = "[Auth] Set Password";
		constructor(public password?: string) {}
	}
}
