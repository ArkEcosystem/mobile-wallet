import { Injectable } from "@angular/core";
import {
	Action,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { first, tap } from "rxjs/operators";

import { IntroActions } from "./intro.actions";
import { IntroConfig } from "./intro.config";
import { IntroService } from "./intro.service";

export interface IntroStateModel {
	isFinished: boolean;
}

export const INTRO_STATE_TOKEN = new StateToken<IntroStateModel>(
	IntroConfig.STORAGE_KEY,
);

const defaultState: IntroStateModel = {
	isFinished: false,
};

@State<IntroStateModel>({
	name: IntroConfig.STORAGE_KEY,
	defaults: defaultState,
})
@Injectable()
export class IntroState implements NgxsOnInit {
	constructor(private introService: IntroService) {}

	@Selector()
	static isFinished(state: IntroStateModel): boolean {
		return state.isFinished;
	}

	public ngxsOnInit(ctx: StateContext<IntroStateModel>): void {
		this.introService
			.load()
			.pipe(
				first(),
				tap((localSettings) => {
					if (localSettings) {
						ctx.patchState({
							isFinished: localSettings === "true",
						});
					}
				}),
			)
			.subscribe();
	}

	@Action(IntroActions.Done)
	public done(ctx: StateContext<IntroStateModel>): void {
		ctx.patchState({ isFinished: true });
	}
}
