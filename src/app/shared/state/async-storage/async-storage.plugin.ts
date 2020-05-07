import { Inject, Injectable, InjectionToken } from "@angular/core";
import {
	actionMatcher,
	getValue,
	InitState,
	NgxsNextPluginFn,
	NgxsPlugin,
	setValue,
	UpdateState,
} from "@ngxs/store";
import { from, iif, of } from "rxjs";
import { concatMap, map, reduce, tap } from "rxjs/operators";

import { AsyncStorageService } from "@/services/storage/async-storage.service";

export const NGXS_ASYNC_STORAGE_PLUGIN_OPTIONS = new InjectionToken(
	"NGXS_ASYNC_STORAGE_PLUGIN_OPTIONS",
);

@Injectable()
export class NgxsAsyncStoragePlugin implements NgxsPlugin {
	private hasRehydrated = false;
	private initialState: any = undefined;

	constructor(
		@Inject(NGXS_ASYNC_STORAGE_PLUGIN_OPTIONS)
		private options: any,
		private storageService: AsyncStorageService,
	) {}

	handle(state: any, event: any, next: NgxsNextPluginFn) {
		const keys: string[] = this.options?.keys || [];
		const matches = actionMatcher(event);
		const isInitAction = matches(InitState);

		// Ignore [Router] patches
		if (matches(UpdateState) && !this.hasRehydrated) {
			this.initialState = state;
		}

		const deserializer$ = from(keys).pipe(
			concatMap((key) =>
				this.storageService
					.getItem(key)
					.pipe(map((val) => ({ key, val }))),
			),
			reduce((previousState, { key, val }) => {
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
					nextState = setValue({ ...previousState }, key, val);
				}

				return nextState;
			}, this.initialState),
			tap(() => (this.hasRehydrated = true)),
		);

		const action$ = iif(() => isInitAction, deserializer$, of(state));

		return action$.pipe(
			concatMap((stateAfterInit) => next(stateAfterInit, event)),
			tap((nextState) => {
				if (!isInitAction && this.hasRehydrated) {
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
