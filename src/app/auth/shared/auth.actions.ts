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

	export class Block {
		static readonly type = "[Auth] Block";
		constructor() {}
	}

	export class Unblock {
		static readonly type = "[Auth] Unblock";
		constructor() {}
	}

	export class Dismiss {
		static readonly type = "[Auth] Dismiss";
		constructor() {}
	}

	export class Authorize {
		static readonly type = "[Auth] Authorize";
		constructor() {}
	}

	export class Deny {
		static readonly type = "[Auth] Deny";
		constructor() {}
	}

	export class IncreaseAttempts {
		static readonly type = "[Auth] Increase Attempts";
		constructor() {}
	}
}

export namespace AuthEvents {
	export class Authorized {
		static readonly type = "[Auth] Authorized";
		constructor() {}
	}

	export class Denied {
		static readonly type = "[Auth] Denied";
		constructor() {}
	}
}
