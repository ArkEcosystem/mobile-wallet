import { Injectable } from "@angular/core";
import { iif, Observable, of } from "rxjs";
import { concatMap, map } from "rxjs/operators";

import { AsyncStorageService } from "@/services/storage/async-storage.service";

import { OnboardingConfig } from "./onboarding.config";

@Injectable({ providedIn: "root" })
export class OnboardingService {
	constructor(private asyncStorage: AsyncStorageService) {}

	/**
	 * Utility triggered immediately by the guard at route startup
	 * supplying the store's rehydration delay
	 */
	public hasFinished(): Observable<boolean> {
		return this.hasFinishedLegacy().pipe(
			concatMap((legacy) =>
				iif(
					() => legacy,
					of(true),
					this.asyncStorage
						.getItem(OnboardingConfig.STORAGE_KEY)
						.pipe(map((state) => JSON.parse(state)?.isFinished)),
				),
			),
		);
	}

	/**
	 * Check if onboarding has been completed before implementing state storage
	 */
	public hasFinishedLegacy(): Observable<boolean> {
		return this.asyncStorage
			.getItem(OnboardingConfig.LEGACY_STORAGE_KEY)
			.pipe(map((result) => result === "true"));
	}
}
