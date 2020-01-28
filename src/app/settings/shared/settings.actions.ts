import { SettingsStateModel } from "./settings.model";

export namespace SettingsActions {
	export class Load {
		public static readonly type = "[Settings] Load";
	}

	export class Update {
		public static readonly type = "[Settings] Update";
		constructor(public key: string, public value: string) {}
	}

	export class Clear {
		public static readonly type = "[Settings] Clear";
	}

	export class Save {
		public static readonly type = "[Settings] Save";
		constructor(public context: SettingsStateModel) {}
	}
}
