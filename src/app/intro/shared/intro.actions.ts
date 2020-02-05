import { IntroStateModel } from "./intro.type";

export namespace IntroActions {
	export class Load {
		public static readonly type = "[Intro] Load";
	}

	export class Update {
		public static readonly type = "[Intro] Update";
		constructor(public payload: Partial<IntroStateModel>) {}
	}

	export class Done {
		public static readonly type = "[Intro] Done";
	}
}
