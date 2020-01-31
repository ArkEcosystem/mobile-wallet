export namespace LoginActions {
	export class Login {
		static readonly type = "[Login] Login";
		constructor(public id: string) {}
	}

	export class Logout {
		static readonly type = "[Login] Logout";
	}
}
