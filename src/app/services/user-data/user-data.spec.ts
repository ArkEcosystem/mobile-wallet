import { fakeAsync, tick } from "@angular/core/testing";
import {
	createServiceFactory,
	mockProvider,
	SpectatorService,
	SpyObject,
} from "@ngneat/spectator";
import { of, Subject } from "rxjs";
import { catchError, map, mapTo, switchMap } from "rxjs/operators";

import * as networksFixtures from "@@/test/fixture/networks.fixture";
import * as profilesFixtures from "@@/test/fixture/profiles.fixture";
import * as walletsFixtures from "@@/test/fixture/wallets.fixture";
import { STORAGE_NETWORKS, STORAGE_PROFILES } from "@/app/app.constants";
import { Profile, StoredNetwork, Wallet } from "@/models/model";

import { AuthProvider } from "../auth/auth";
import { ForgeProvider } from "../forge/forge";
import { StorageProvider } from "../storage/storage";
import { UserDataServiceImpl } from "./user-data";
import { UserDataService } from "./user-data.interface";

describe("User Data Service", () => {
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

	describe("Profile", () => {
		it("should add profile", (done) => {
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

		it("should remove profile by id", (done) => {
			userDataService
				.removeProfileById("profile1")
				.pipe(mapTo(userDataService.getProfileById("profile1")))
				.subscribe((profile) => {
					expect(profile).toBeUndefined();
					done();
				});
		});
	});

	describe("Network", () => {
		it("should get the network by id", () => {
			expect(userDataService.getNetworkById("mainnet")).toEqual(
				jasmine.objectContaining({
					name: "mainnet",
				}),
			);
		});

		it("should remove the network by id", (done) => {
			userDataService.removeNetworkById("mainnet").subscribe(() => {
				expect(
					userDataService.getNetworkById("mainnet"),
				).toBeUndefined();
				done();
			});
		});

		it("should add network", (done) => {
			const customNetwork = new StoredNetwork();
			customNetwork.name = "testnet";
			userDataService
				.addOrUpdateNetwork(customNetwork)
				.subscribe((result) => {
					expect(result).toEqual(
						jasmine.objectContaining({
							id: jasmine.any(String),
							network: jasmine.objectContaining({
								name: customNetwork.name,
							}),
						}),
					);
					done();
				});
		});

		it("should update network", (done) => {
			const id = "mainnet";
			const network = new StoredNetwork();
			network.name = "Custom Mainnet";

			userDataService
				.addOrUpdateNetwork(network, id)
				.pipe(mapTo(userDataService.getNetworkById(id)))
				.subscribe((result) => {
					expect(result).toEqual(
						jasmine.objectContaining({
							name: network.name,
						}),
					);
					done();
				});
		});
	});

	describe("Wallet", () => {
		it("should set the current wallet", () => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			userDataService.setCurrentWallet(wallet);
			expect(userDataService.currentWallet).toEqual(wallet);
		});

		it("should clear the current wallet", () => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			userDataService.setCurrentWallet(wallet);
			expect(userDataService.currentWallet).toEqual(wallet);
			userDataService.clearCurrentWallet();
			expect(userDataService.currentWallet).toBeUndefined();
		});

		it("should fail if the profile is not specified", (done) => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			userDataService
				.addWallet(wallet, null, null)
				.subscribe(null, (error) => {
					expect(error).toBe("EMPTY_PROFILE_ID");
					done();
				});
		});

		it("should fail if the profile is not found", (done) => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			userDataService
				.addWallet(wallet, null, null, "custom")
				.subscribe(null, (error) => {
					expect(error).toBe("PROFILE_NOT_FOUND");
					done();
				});
		});

		it("should add wallet with encryption", (done) => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			const profileId = "profile1";
			const passphrase = "ark";
			const pinCode = "123";
			const forgeProvider = spectator.get<ForgeProvider>(ForgeProvider);
			forgeProvider.generateIv.and.returnValue("iv");
			forgeProvider.encrypt.and.returnValue("secret");
			userDataService
				.addWallet(wallet, passphrase, pinCode, profileId)
				.pipe(mapTo(userDataService.getProfileById(profileId)))
				.subscribe((profile) => {
					expect(Object.keys(profile.wallets).length).toBe(1);
					expect(profile.wallets[wallet.address]).toEqual(
						jasmine.objectContaining({
							iv: "iv",
							cipherKey: "secret",
						}),
					);
					done();
				});
		});

		it("should add wallet and skip encryption if no passphrase is specified", () => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			const profileId = "profile1";

			userDataService
				.addWallet(wallet, null, null, profileId)
				.pipe(mapTo(userDataService.getProfileById(profileId)))
				.subscribe((profile) => {
					expect(profile.wallets[wallet.address]).toEqual(
						jasmine.objectContaining(walletsFixtures.wallet1),
					);
				});
		});

		it("should not add wallet if the address already exists", () => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			const profileId = "profile1";

			userDataService
				.addWallet(wallet, null, null, profileId)
				.pipe(
					switchMap(() => {
						const otherWallet = new Wallet().deserialize(
							walletsFixtures.wallet1,
						);
						otherWallet.label = "test";
						return userDataService.addWallet(
							otherWallet,
							null,
							null,
							profileId,
						);
					}),
					mapTo(userDataService.getProfileById(profileId)),
				)
				.subscribe((profile) => {
					expect(profile.wallets[wallet.address].label).not.toBe(
						"test",
					);
				});
		});

		it("should get the wallet label", () => {
			const walletWithLabel = new Wallet().deserialize({
				...walletsFixtures.wallet1,
				label: "My Label",
			});
			const walletWithUsername = new Wallet().deserialize(
				walletsFixtures.wallet2,
			);
			expect(userDataService.getWalletLabel(walletWithUsername)).toBe(
				walletWithUsername.username,
			);
			expect(userDataService.getWalletLabel(walletWithLabel)).toBe(
				walletWithLabel.label,
			);
		});

		it("should get the wallet label by address", (done) => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			wallet.label = "test";
			const profileId = "profile1";
			userDataService
				.addWallet(wallet, null, null, profileId)
				.pipe(
					mapTo(
						userDataService.getWalletLabel(
							wallet.address,
							profileId,
						),
					),
				)
				.subscribe((label) => {
					expect(label).toEqual(wallet.label);
					done();
				});
		});

		it("should update the wallet", (done) => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			const profileId = "profile1";
			userDataService
				.addWallet(wallet, null, null, profileId)
				.pipe(
					switchMap(() => {
						wallet.label = "test";
						return userDataService.updateWallet(wallet, profileId);
					}),
					mapTo(
						userDataService.getWalletByAddress(
							wallet.address,
							profileId,
						),
					),
				)
				.subscribe((wallet) => {
					expect(wallet.label).toEqual(wallet.label);
					done();
				});
		});

		it("should fail to update the wallet if no profileId is specified", (done) => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			userDataService
				.updateWallet(wallet, undefined)
				.subscribe(null, (error) => {
					expect(error).toBe("EMPTY_PROFILE_ID");
					done();
				});
		});

		it("should remove wallet by address", (done) => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			const profileId = "profile1";
			userDataService
				.addWallet(wallet, null, null, profileId)
				.pipe(
					switchMap(() => {
						return userDataService.removeWalletByAddress(
							wallet.address,
							profileId,
						);
					}),
					map(() =>
						userDataService.getWalletByAddress(
							wallet.address,
							profileId,
						),
					),
				)
				.subscribe((wallet) => {
					expect(wallet).toBeNull();
					done();
				});
		});

		it("should not get the wallet keys if there is no encripted key", () => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			expect(
				userDataService.getKeysByWallet(wallet, "secret"),
			).toBeUndefined();
		});

		it("should fail to get the decrypted keys if there is no encripted key", () => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			expect(
				userDataService.getKeysByWallet(wallet, "123"),
			).toBeUndefined();
		});

		it("should get the decrypted keys", () => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			wallet.cipherKey = "terces";
			const forgeProvider = spectator.get<ForgeProvider>(ForgeProvider);
			forgeProvider.decrypt.and.returnValue("secret");
			expect(userDataService.getKeysByWallet(wallet, "123")).toEqual(
				jasmine.objectContaining({
					key: "secret",
				}),
			);
		});
	});

	describe("Logged in", () => {
		let authService: SpyObject<AuthProvider>;

		beforeEach(() => {
			authService = spectator.get<AuthProvider>(AuthProvider);
		});

		it("should assign the current profile", (done) => {
			userDataService.onSelectProfile$.subscribe((profile) => {
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

		it("should set the wallet label", (done) => {
			const profileId = "profile1";
			authService.onLogin$.next(profileId);
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			const label = "test";

			userDataService
				.addWallet(wallet, null, null, profileId)
				.pipe(
					switchMap(() => {
						return userDataService.setWalletLabel(wallet, label);
					}),
					map(() =>
						userDataService.getWalletByAddress(
							wallet.address,
							profileId,
						),
					),
				)
				.subscribe((wallet) => {
					expect(wallet.label).toEqual(label);
					done();
				});
		});

		it("should fail to set the wallet label if the wallet is not specified", (done) => {
			userDataService
				.setWalletLabel(undefined, "test")
				.subscribe(null, (error) => {
					expect(error).toEqual(
						jasmine.objectContaining({
							key: "VALIDATION.INVALID_WALLET",
						}),
					);
					done();
				});
		});

		it("should fail to set the wallet label if it already exists", (done) => {
			const profileId = "profile1";
			authService.onLogin$.next(profileId);
			authService.loggedProfileId = profileId;
			const wallet1 = new Wallet().deserialize(walletsFixtures.wallet1);
			wallet1.label = "one";
			const wallet2 = new Wallet().deserialize(walletsFixtures.wallet2);
			userDataService
				.addWallet(wallet1, null, null, profileId)
				.pipe(
					switchMap(() =>
						userDataService.addWallet(
							wallet2,
							null,
							null,
							profileId,
						),
					),
					switchMap(() =>
						userDataService.setWalletLabel(wallet2, "one"),
					),
				)
				.subscribe(null, (error) => {
					expect(error).toEqual(
						jasmine.objectContaining({
							key: "VALIDATION.LABEL_EXISTS",
						}),
					);
					done();
				});
		});

		it("should convert wallet into delegate", (done) => {
			const profileId = "profile1";
			authService.onLogin$.next(profileId);
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
			const username = "delegate";
			userDataService
				.addWallet(wallet, null, null, profileId)
				.pipe(
					switchMap(() => {
						return userDataService.ensureWalletDelegateProperties(
							wallet,
							username,
						);
					}),
					map(() =>
						userDataService.getWalletByAddress(
							wallet.address,
							profileId,
						),
					),
				)
				.subscribe((wallet) => {
					expect(wallet).toEqual(
						jasmine.objectContaining({
							isDelegate: true,
							username,
						}),
					);
					done();
				});
		});

		it("should fail to convert wallet into delegate", (done) => {
			const wallet = new Wallet().deserialize(walletsFixtures.wallet1);

			userDataService
				.ensureWalletDelegateProperties(undefined, "delegate")
				.pipe(
					catchError((error) => {
						expect(error).toBe("WALLET_EMPTY");
						return userDataService.ensureWalletDelegateProperties(
							wallet,
							undefined,
						);
					}),
				)
				.subscribe(null, (error) => {
					expect(error).toBe("USERNAME_EMPTY");
					done();
				});
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
