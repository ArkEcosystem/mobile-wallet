import { Injectable } from "@angular/core";
import { Action, State, StateContext, StateToken } from "@ngxs/store";
import produce from "immer";

import { ProfileActions } from "./profile.actions";
import { Profile } from "./profile.types";

export interface ProfileStateModel {
	profiles: Profile[];
}

export const PROFILE_STATE_TOKEN = new StateToken<ProfileStateModel>("profile");

@State({
	name: "profile",
	defaults: {
		profiles: [],
	},
})
@Injectable()
export class ProfileState {
	constructor() {}

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
