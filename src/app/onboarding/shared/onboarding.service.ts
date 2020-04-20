import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { StorageProvider } from "@/services/storage/storage";

import { OnboardingConfig } from "./onboarding.config";

@Injectable({ providedIn: "root" })
export class OnboardingService {
	constructor(private storageProvider: StorageProvider) {}

	public load(): Observable<string> {
		return this.storageProvider.get(OnboardingConfig.LEGACY_STORAGE_KEY);
	}
}
