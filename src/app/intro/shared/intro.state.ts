import { Injectable } from "@angular/core";
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

import { IntroActions } from "./intro.actions";
import { IntroConfig } from "./intro.config";
import { IntroService } from "./intro.service";
import { IntroStateModel } from "./intro.type";

export const INTRO_STATE_TOKEN = new StateToken<IntroStateModel>(
	IntroConfig.STORAGE_KEY,
);

const defaultState: IntroStateModel = {
	activeIndex: 0,
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
	static activeIndex(state: IntroStateModel): number {
		return state.activeIndex;
	}
	@Selector()
	static isFinished(state: IntroStateModel): boolean {
		return state.isFinished;
	}

	public ngxsOnInit(ctx: StateContext<IntroStateModel>): void {
		ctx.dispatch(new IntroActions.Load());
	}

	@Action(IntroActions.Update)
	public update(
		ctx: StateContext<IntroStateModel>,
		action: IntroActions.Update,
	): void {
		ctx.patchState(action.payload);
	}

	@Action(IntroActions.Load)
	public load(
		ctx: StateContext<IntroStateModel>,
	): Observable<Partial<IntroStateModel>> {
		return this.introService.load().pipe(
			tap((localSettings) => {
				ctx.setState({ ...this.defaults, ...localSettings });
			}),
		);
	}

	@Action(IntroActions.Done)
	public done(ctx: StateContext<IntroStateModel>): void {
		ctx.patchState({ isFinished: true });
	}

	private get defaults(): IntroStateModel {
		return defaultState;
	}
}
