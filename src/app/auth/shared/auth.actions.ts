export namespace AuthActions {
	export class Login {
		static readonly type = "[Auth] Login";
		constructor(public id: string) {}
	}

	export class Logout {
		static readonly type = "[Auth] Logout";
	}
}
