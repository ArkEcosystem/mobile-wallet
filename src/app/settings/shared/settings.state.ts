import {
	Action,
	NgxsOnInit,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { tap } from "rxjs/operators";
import { SETTINGS_TOKEN } from "../settings.config";
import { SettingsActions } from "./settings.actions";
import { SettingsStateModel } from "./settings.model";
import { SettingsService } from "./settings.service";

export const SETTINGS_STATE_TOKEN = new StateToken<SettingsStateModel>(
	SETTINGS_TOKEN,
);

const defaultState: SettingsStateModel = {
	language: "en",
	currency: "usd",
	darkMode: false,
	notification: false,
	wordlistLanguage: "english",
};

@State<SettingsStateModel>({
	name: SETTINGS_STATE_TOKEN,
	defaults: defaultState,
})
export class SettingsState implements NgxsOnInit {
	constructor(private settingsService: SettingsService) {}

	public ngxsOnInit(ctx: StateContext<SettingsStateModel>) {
		ctx.dispatch(new SettingsActions.Load());
	}

	@Action(SettingsActions.Load)
	public load(ctx: StateContext<SettingsStateModel>) {
		return this.settingsService.load().pipe(
			tap(localSettings => {
				if (localSettings) {
					ctx.setState(localSettings);
				}
			}),
		);
	}

	@Action(SettingsActions.Clear)
	public clear(ctx: StateContext<SettingsStateModel>) {
		return this.settingsService
			.clear()
			.pipe(tap(() => ctx.setState(defaultState)));
	}
}
