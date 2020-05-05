import { SettingsStateModel } from "./settings.type";

export namespace SettingsActions {
	export class Load {
		public static readonly type = "[Settings] Load";
	}

	export class Update {
		public static readonly type = "[Settings] Update";
		constructor(public payload: Partial<SettingsStateModel>) {}
	}

	export class Clear {
		public static readonly type = "[Settings] Clear";
	}
}
