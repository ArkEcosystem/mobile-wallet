import { Injectable } from "@angular/core";
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

import { SettingsActions } from "./settings.actions";
import { SettingsConfig } from "./settings.config";
import { SettingsService } from "./settings.service";
import { SettingsStateModel } from "./settings.type";

export const SETTINGS_STATE_TOKEN = new StateToken<SettingsStateModel>(
	SettingsConfig.STORAGE_KEY,
);

const defaultState: SettingsStateModel = {
	language: "en",
	currency: "usd",
	wordlistLanguage: "english",
	darkMode: false,
	devMode: false,
};

@State<SettingsStateModel>({
	name: SettingsConfig.STORAGE_KEY,
	defaults: defaultState,
})
@Injectable()
export class SettingsState implements NgxsOnInit {
	constructor(
		private settingsService: SettingsService,
		private translateService: TranslateService,
	) {}

	@Selector()
	static language(state: SettingsStateModel): string {
		return state.language;
	}

	@Selector()
	static currency(state: SettingsStateModel): string {
		return state.currency;
	}

	@Selector()
	static wordlistLanguage(state: SettingsStateModel): string {
		return state.wordlistLanguage;
	}

	@Selector()
	static darkMode(state: SettingsStateModel): boolean {
		return state.darkMode;
	}

	@Selector()
	static devMode(state: SettingsStateModel): boolean {
		return state.devMode;
	}

	public ngxsOnInit(ctx: StateContext<SettingsStateModel>): void {
		ctx.dispatch(new SettingsActions.Load());
	}

	@Action(SettingsActions.Update)
	public update(
		ctx: StateContext<SettingsStateModel>,
		action: SettingsActions.Update,
	): void {
		ctx.patchState(action.payload);
	}

	@Action(SettingsActions.Load)
	public load(
		ctx: StateContext<SettingsStateModel>,
	): Observable<Partial<SettingsStateModel>> {
		return this.settingsService.load().pipe(
			tap((localSettings) => {
				ctx.setState({ ...this.defaults, ...localSettings });
			}),
		);
	}

	@Action(SettingsActions.Clear)
	public clear(ctx: StateContext<SettingsStateModel>): void {
		this.settingsService.clear();

		ctx.setState(this.defaults);
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
