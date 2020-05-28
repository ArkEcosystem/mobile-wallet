import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";

import { SdkEnvironment } from "@/app/sdk/shared/sdk-env.service";

import { OnboardingConfig } from "./onboarding.config";

@Injectable({ providedIn: "root" })
export class OnboardingService {
	constructor(private sdkEnvirnoment: SdkEnvironment) {}

	public hasSeen(): Observable<boolean> {
		return from(
			this.sdkEnvirnoment.data().has(OnboardingConfig.STORAGE_KEY),
		);
	}

	public save() {
		return from(
			this.sdkEnvirnoment
				.data()
				.set(OnboardingConfig.STORAGE_KEY, "true"),
		);
	}
}
