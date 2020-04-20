import { Injectable, Injector } from "@angular/core";
import {
	actionMatcher,
	getValue,
	InitState,
	NgxsNextPluginFn,
	NgxsPlugin,
	setValue,
	Store,
	UpdateState,
} from "@ngxs/store";
import { from, iif, of } from "rxjs";
import { concatMap, map, reduce, shareReplay, tap } from "rxjs/operators";

import { AuthConfig } from "@/app/auth/shared/auth.config";
import { OnboardingConfig } from "@/app/onboarding/shared/onboarding.config";
import { NgxsAsyncStorageService } from "@/app/shared/state/async-storage/async-storage.service";

@Injectable()
export class NgxsAsyncStoragePlugin implements NgxsPlugin {
	private KEYS = [AuthConfig.STORAGE_KEY, OnboardingConfig.STORAGE_KEY];

	constructor(
		private storageService: NgxsAsyncStorageService,
		private _injector: Injector,
	) {}

	/**
	 * Lazy get the store for circular dependency issues
	 */
	private get store(): Store {
		return this._injector.get<Store>(Store);
	}

	handle(state: any, event: any, next: NgxsNextPluginFn) {
		const matches = actionMatcher(event);
		const isInitAction = matches(InitState) || matches(UpdateState);

		const deserializer$ = from(this.KEYS).pipe(
			concatMap((key) =>
				this.storageService
					.getItem(key)
					.pipe(map((val) => ({ key, val }))),
			),
			concatMap((payload) =>
				this.store
					.selectOnce((lastState) => lastState)
					.pipe(
						map((lastState) => ({
							lastState,
							...payload,
						})),
					),
			),
			reduce((_, { key, val, lastState }) => {
				if (
					val !== "undefined" &&
					typeof val !== "undefined" &&
					val !== null
				) {
					try {
						val = JSON.parse(val);
					} catch (e) {
						console.error(
							"Error ocurred while deserializing the store value, falling back to empty object.",
						);
						val = {};
					}
				}

				const nextState = setValue(lastState, key, val);
				return nextState;
			}),
		);

		const action$ = iif(
			() => isInitAction,
			deserializer$.pipe(shareReplay(1)),
			of(state),
		);

		return action$.pipe(
			concatMap((stateAfterInit) => next(stateAfterInit, event)),
			tap((nextState) => {
				if (!isInitAction) {
					for (const key of this.KEYS) {
						let val = nextState;

						val = getValue(nextState, key);

						try {
							this.storageService.setItem(
								key,
								JSON.stringify(val),
							);
						} catch (e) {
							console.error(
								"Error ocurred while serializing the store value, value not updated.",
							);
						}
					}
				}
			}),
		);
	}
}
