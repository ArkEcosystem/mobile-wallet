export namespace DelegateActions {
	export class Refresh {
		static readonly type = "[Delegate] Refresh";
		constructor(public payload: { page: number; limit: number }) {}
	}

	export class Clear {
		static readonly type = "[Delegate] Clear";
		constructor() {}
	}
}
