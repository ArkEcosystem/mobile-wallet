export namespace DelegateActions {
	export interface RefreshPayload {
		page: number;
		limit: number;
	}

	export class Refresh {
		static readonly type = "[Delegate] Refresh";
		constructor(public payload: RefreshPayload) {}
	}

	export class Clear {
		static readonly type = "[Delegate] Clear";
		constructor() {}
	}
}
