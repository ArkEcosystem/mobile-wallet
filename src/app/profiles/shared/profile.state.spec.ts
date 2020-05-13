import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";

import { ProfileActions } from "./profile.actions";
import { PROFILE_STATE_TOKEN, ProfileState } from "./profile.state";

describe("Profile State", () => {
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NgxsModule.forRoot([ProfileState])],
		});

		store = TestBed.get(Store);
	});

	it("should create", () => {
		const state = store.selectSnapshot(PROFILE_STATE_TOKEN);
		const profiles = store.selectSnapshot(ProfileState.profiles);
		expect(state).toEqual({
			profiles: [],
		});
		expect(profiles.length).toBe(0);
	});

	it("should add", () => {
		const profile = { name: "Test" };
		store.dispatch(new ProfileActions.Add(profile));
		const profiles = store.selectSnapshot(ProfileState.profiles);
		expect(profiles.length).toBe(1);
		expect(profiles[0].profileId).toBe("1");
		expect(profiles[0].name).toBe(profile.name);
	});
});
