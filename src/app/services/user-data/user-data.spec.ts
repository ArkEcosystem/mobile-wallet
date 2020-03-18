import { fakeAsync, flushMicrotasks, tick } from "@angular/core/testing";
import {
	createServiceFactory,
	mockProvider,
	SpectatorService,
	SpyObject,
} from "@ngneat/spectator";
import { of, Subject } from "rxjs";
import { map, mapTo, switchMapTo } from "rxjs/operators";

import * as networksFixtures from "@@/test/fixture/networks.fixture";
import * as profilesFixtures from "@@/test/fixture/profiles.fixture";
import { STORAGE_NETWORKS, STORAGE_PROFILES } from "@/app/app.constants";
import { Profile, StoredNetwork } from "@/models/model";

import { AuthProvider } from "../auth/auth";
import { ForgeProvider } from "../forge/forge";
import { StorageProvider } from "../storage/storage";
import { UserDataServiceImpl } from "./user-data";
import { UserDataService } from "./user-data.interface";

fdescribe("User Data Service", () => {
	let userDataService: UserDataService;
	let spectator: SpectatorService<UserDataServiceImpl>;

	const createService = createServiceFactory({
		service: UserDataServiceImpl,
		mocks: [ForgeProvider],
		providers: [
			mockProvider(StorageProvider, {
				set: () => of(true),
				onClear$: new Subject(),
				getObject: (prop: string) => {
					switch (prop) {
						case STORAGE_PROFILES:
							return of(profilesFixtures);
						case STORAGE_NETWORKS:
							return of(networksFixtures);
					}
				},
			}),
			mockProvider(AuthProvider, {
				onLogin$: new Subject(),
			}),
		],
	});

	beforeEach(() => {
		spectator = createService();
		userDataService = spectator.service;
	});

	it("should load profiles and networks on init", () => {
		expect(Object.keys(userDataService.profiles)).toEqual(
			Object.keys(profilesFixtures),
		);
		expect(Object.keys(userDataService.networks)).toEqual(
			Object.keys(networksFixtures),
		);
	});

	it("should get the network by id", () => {
		expect(userDataService.getNetworkById("mainnet")).toEqual(
			jasmine.objectContaining({
				name: "mainnet",
			}),
		);
	});

	it("should remove the network by id", done => {
		userDataService.removeNetworkById("mainnet").subscribe(() => {
			expect(userDataService.getNetworkById("mainnet")).toBeUndefined();
			done();
		});
	});

	it("should add profile", done => {
		const newProfile = new Profile().deserialize({
			name: "Profile 3",
			networkId: "mainnet",
		});
		userDataService.addProfile(newProfile).subscribe(() => {
			expect(
				userDataService.getProfileByName(newProfile.name),
			).toBeTruthy();
			done();
		});
	});

	it("should get profile by name", () => {
		const { profile1 } = profilesFixtures;
		expect(userDataService.getProfileByName(profile1.name)).toEqual(
			jasmine.objectContaining({
				name: profile1.name,
				networkId: profile1.networkId,
			}),
		);
	});

	it("should get profile by id", () => {
		const { profile1 } = profilesFixtures;
		expect(userDataService.getProfileById("profile1")).toEqual(
			jasmine.objectContaining({
				name: profile1.name,
				networkId: profile1.networkId,
			}),
		);
	});

	it("should remove profile by id", done => {
		userDataService
			.removeProfileById("profile1")
			.pipe(mapTo(userDataService.getProfileById("profile1")))
			.subscribe(profile => {
				expect(profile).toBeUndefined();
				done();
			});
	});

	describe("Logged in", () => {
		let authService: SpyObject<AuthProvider>;

		beforeEach(() => {
			authService = spectator.get<AuthProvider>(AuthProvider);
		});

		it("should assign the current profile", done => {
			userDataService.onSelectProfile$.subscribe(profile => {
				expect(profile).toBeTruthy();
				done();
			});
			authService.onLogin$.next("profile1");
			expect(userDataService.currentProfile).toEqual(
				jasmine.objectContaining(profilesFixtures.profile1),
			);
		});

		it("should assign the current network", () => {
			authService.onLogin$.next("profile1");
			expect(userDataService.currentNetwork.name).toBe(
				networksFixtures[profilesFixtures.profile1.networkId].name,
			);
		});

		it("should update the current network", () => {
			authService.onLogin$.next("profile1");
			const network = new StoredNetwork();
			network.token = "test";
			userDataService.onUpdateNetwork$.next(network);
			expect(userDataService.currentNetwork.token).toBe("test");
		});

		it("should not fail when logging in an empty user", () => {
			authService.onLogin$.next(null);
			expect(userDataService.currentProfile).toBeNull();
		});

		it("should return true if the current network is mainnet", () => {
			authService.onLogin$.next("profile1");
			expect(userDataService.isMainNet).toBe(true);
		});

		it("should return true if the current network is devnet", () => {
			authService.onLogin$.next("profile2");
			expect(userDataService.isDevNet).toBe(true);
		});
	});

	describe("Clear storage", () => {
		let storageProvider: SpyObject<StorageProvider>;

		beforeEach(() => {
			storageProvider = spectator.get<StorageProvider>(StorageProvider);
			spyOn(storageProvider, "getObject").and.returnValue(of(undefined));
		});

		it("should reset profiles list and the current profile", fakeAsync(() => {
			storageProvider.onClear$.next();
			tick(100);
			expect(userDataService.profiles).toEqual(jasmine.empty());
			expect(userDataService.currentProfile).toBeNull();
		}));

		it("should assign defaults networks", fakeAsync(() => {
			storageProvider.onClear$.next();
			tick(100);
			expect(userDataService.networks).toEqual(jasmine.any(Object));
			expect(Object.keys(userDataService.networks).length).toBe(2);
		}));
	});
});
