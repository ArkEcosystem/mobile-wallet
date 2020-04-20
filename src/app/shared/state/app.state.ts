import { Injectable } from "@angular/core";
import {
	NgxsAfterBootstrap,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";

interface AppStateModel {
	isReady: boolean;
}

export const APP_STATE_TOKEN = new StateToken<AppStateModel>("app");

@State<AppStateModel>({
	name: "app",
	defaults: {
		isReady: false,
	},
})
@Injectable()
export class AppState implements NgxsAfterBootstrap {
	constructor() {}

	@Selector()
	static isReady(state: AppStateModel) {
		return state.isReady;
	}

	ngxsAfterBootstrap(ctx: StateContext<AppStateModel>) {
		ctx.patchState({ isReady: true });
	}
}
