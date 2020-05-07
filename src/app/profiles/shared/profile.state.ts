import { Injectable } from "@angular/core";
import {
	Action,
	createSelector,
	Selector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import produce from "immer";

import { ProfileActions } from "./profile.actions";
import { ProfileConfig } from "./profile.config";
import { Profile } from "./profile.types";

export interface ProfileStateModel {
	profiles: Profile[];
}

export const PROFILE_STATE_TOKEN = new StateToken<ProfileStateModel>(
	ProfileConfig.STORAGE_KEY,
);

@State({
	name: ProfileConfig.STORAGE_KEY,
	defaults: {
		profiles: [],
	},
})
@Injectable()
export class ProfileState {
	constructor() {}

	@Selector()
	public static profiles(state: ProfileStateModel) {
		return state.profiles;
	}

	public static profileById(id: string) {
		return createSelector([ProfileState], (state: ProfileStateModel) => {
			return state.profiles.find((profile) => profile.profileId === id);
		});
	}

	@Action(ProfileActions.Add)
	public add(
		ctx: StateContext<ProfileStateModel>,
		{ payload }: ProfileActions.Add,
	) {
		ctx.setState(
			produce((draft: ProfileStateModel) => {
				const profileId = (draft.profiles.length + 1).toString();
				const name = payload.name;

				draft.profiles.push({
					profileId,
					name,
					wallets: {},
				});
			}),
		);
	}
}
