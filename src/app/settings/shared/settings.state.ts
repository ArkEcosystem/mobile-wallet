import { TranslateService } from "@ngx-translate/core";
import {
	Action,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SettingsConfig } from "../settings.config";
import { SettingsActions } from "./settings.actions";
import { SettingsService } from "./settings.service";
import { SettingsStateModel } from "./settings.type";

export const SETTINGS_STATE_TOKEN = new StateToken<SettingsStateModel>(
	SettingsConfig.TOKEN,
);

const defaultState: SettingsStateModel = {
	language: "en",
	currency: "usd",
	darkMode: false,
	wordlistLanguage: "english",
};

@State<SettingsStateModel>({
	name: SETTINGS_STATE_TOKEN,
	defaults: defaultState,
})
export class SettingsState implements NgxsOnInit {
	@Selector()
	static language(state: SettingsStateModel): string {
		return state.language;
	}

	@Selector()
	static darkMode(state: SettingsStateModel): boolean {
		return state.darkMode;
	}

	constructor(
		private settingsService: SettingsService,
		private translateService: TranslateService,
	) {}

	public ngxsOnInit(ctx: StateContext<SettingsStateModel>): void {
		ctx.dispatch(new SettingsActions.Load());
	}

	@Action(SettingsActions.Update)
	public update(
		ctx: StateContext<SettingsStateModel>,
		action: SettingsActions.Update,
	): Observable<void> {
		ctx.patchState(action.payload);
		const state = ctx.getState();
		return this.settingsService.save(state);
	}

	@Action(SettingsActions.Load)
	public load(
		ctx: StateContext<SettingsStateModel>,
	): Observable<Partial<SettingsStateModel>> {
		return this.settingsService.load().pipe(
			tap(localSettings => {
				ctx.setState({ ...this.defaults, ...localSettings });
			}),
		);
	}

	@Action(SettingsActions.Clear)
	public clear(ctx: StateContext<SettingsStateModel>): Observable<void> {
		return this.settingsService
			.clear()
			.pipe(tap(() => ctx.setState(this.defaults)));
	}

	private get defaults(): SettingsStateModel {
		const cultureLang = this.translateService.getBrowserCultureLang();
		const browserLang = this.translateService.getBrowserLang();
		const appLang = SettingsConfig.LANGUAGES[cultureLang]
			? cultureLang
			: SettingsConfig.LANGUAGES[browserLang]
			? browserLang
			: "en";

		// @ts-ignore
		return { ...defaultState, language: appLang };
	}
}