export namespace PinActions {
	export class Register {
		static readonly type = "[Pin] Register";
		constructor(public pin: string) {}
	}

	export class Request {
		static readonly type = "[Pin] Request";
		constructor() {}
	}

	export class Verify {
		static readonly type = "[Pin] Verify";
		constructor() {}
	}
}
