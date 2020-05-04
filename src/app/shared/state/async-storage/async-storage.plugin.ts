import { Inject, Injectable, InjectionToken, Injector } from "@angular/core";
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

import { AsyncStorageService } from "@/services/storage/async-storage.service";

export const NGXS_ASYNC_STORAGE_PLUGIN_OPTIONS = new InjectionToken(
	"NGXS_ASYNC_STORAGE_PLUGIN_OPTIONS",
);

@Injectable()
export class NgxsAsyncStoragePlugin implements NgxsPlugin {
	constructor(
		@Inject(NGXS_ASYNC_STORAGE_PLUGIN_OPTIONS)
		private options: any,
		private storageService: AsyncStorageService,
		private _injector: Injector,
	) {}

	/**
	 * Lazy get the store for circular dependency issues
	 */
	private get store(): Store {
		return this._injector.get<Store>(Store);
	}

	handle(state: any, event: any, next: NgxsNextPluginFn) {
		const keys: string[] = this.options?.keys || [];
		const matches = actionMatcher(event);
		const isInitAction = matches(InitState) || matches(UpdateState);

		const deserializer$ = from(keys).pipe(
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
			reduce((previousState, { key, val, lastState }) => {
				let nextState = previousState;

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
					nextState = setValue(
						{ ...previousState, ...lastState },
						key,
						val,
					);
				}

				return nextState;
			}, state),
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
					for (const key of keys) {
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
