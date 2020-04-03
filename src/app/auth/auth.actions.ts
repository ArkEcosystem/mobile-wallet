export namespace AuthActions {
	export class Open {
		static readonly type = "[Auth] Open";
		constructor() {}
	}

	export class Cancel {
		static readonly type = "[Auth] Cancel";
		constructor() {}
	}

	export class Validate {
		static readonly type = "[Auth] Validate";
		constructor(public password: string) {}
	}
}
