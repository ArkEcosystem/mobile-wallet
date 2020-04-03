export namespace AuthActions {
	export class Open {
		static readonly type = "[Auth] Open";
		constructor() {}
	}

	export class Validate {
		static readonly type = "[Auth] Validate";
		constructor(public password: string) {}
	}

	export class Validated {
		static readonly type = "[Auth] Validated";
		constructor() {}
	}
}
