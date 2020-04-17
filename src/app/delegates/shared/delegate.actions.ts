export namespace DelegateActions {
	export interface FetchPayload {
		page: number;
		limit: number;
	}

	export class Fetch {
		static readonly type = "[Delegate] Fetch";
		constructor(public payload: FetchPayload) {}
	}

	export class Clear {
		static readonly type = "[Delegate] Clear";
		constructor() {}
	}
}
