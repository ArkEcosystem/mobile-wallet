import { Injectable } from "@angular/core";
import { Navigate } from "@ngxs/router-plugin";
import {
	Action,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { tap } from "rxjs/operators";

import { OnboardingActions } from "./onboarding.actions";
import { OnboardingConfig } from "./onboarding.config";
import { OnboardingService } from "./onboarding.service";

export interface OnboardingStateModel {
	isFinished: boolean;
}

export const ONBOARDING_STATE_TOKEN = new StateToken<OnboardingStateModel>(
	OnboardingConfig.STORAGE_KEY,
);

const defaultState: OnboardingStateModel = {
	isFinished: false,
};

@State<OnboardingStateModel>({
	name: OnboardingConfig.STORAGE_KEY,
	defaults: defaultState,
})
@Injectable()
export class OnboardingState implements NgxsOnInit {
	constructor(private onboardingService: OnboardingService) {}

	@Selector()
	static isFinished(state: OnboardingStateModel): boolean {
		return state.isFinished;
	}

	public ngxsOnInit(ctx: StateContext<OnboardingStateModel>): void {
		this.onboardingService
			.hasFinishedLegacy()
			.pipe(
				tap((isFinished) => {
					if (isFinished) {
						ctx.patchState({
							isFinished,
						});
					}
				}),
			)
			.subscribe();
	}

	@Action(OnboardingActions.Done)
	public done(ctx: StateContext<OnboardingStateModel>) {
		ctx.patchState({ isFinished: true });
		return ctx.dispatch(new Navigate(["/signup"]));
	}
}
