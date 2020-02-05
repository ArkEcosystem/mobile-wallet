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
import { IntroConfig } from "../intro.config";
import { IntroActions } from "./intro.actions";
import { IntroService } from "./intro.service";
import { IntroStateModel } from "./intro.type";

export const INTRO_STATE_TOKEN = new StateToken<IntroStateModel>(
	IntroConfig.TOKEN,
);

const defaultState: IntroStateModel = {
	activeIndex: 0,
};

@State<IntroStateModel>({
	name: INTRO_STATE_TOKEN,
	defaults: defaultState,
})
export class IntroState implements NgxsOnInit {
	@Selector()
	static activeIndex(state: IntroStateModel): number {
		return state.activeIndex;
	}
	constructor(private introService: IntroService) {}

	public ngxsOnInit(ctx: StateContext<IntroStateModel>): void {
		ctx.dispatch(new IntroActions.Load());
	}

	@Action(IntroActions.Update)
	public update(
		ctx: StateContext<IntroStateModel>,
		action: IntroActions.Update,
	): Observable<void> {
		ctx.patchState(action.payload);
		const state = ctx.getState();
		return this.introService.save(state);
	}

	@Action(IntroActions.Load)
	public load(
		ctx: StateContext<IntroStateModel>,
	): Observable<Partial<IntroStateModel>> {
		return this.introService.load().pipe(
			tap(localSettings => {
				ctx.setState({ ...this.defaults, ...localSettings });
			}),
		);
	}

	@Action(IntroActions.Skip)
	public skip(ctx: StateContext<IntroStateModel>): Observable<void> {
		return;
	}

	private get defaults(): IntroStateModel {
		return defaultState;
	}
}
