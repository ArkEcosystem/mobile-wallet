export namespace ProfileActions {
	export class Add {
		static readonly type = "[Profile] Add";
		constructor(public payload: { name: string }) {}
	}
}
