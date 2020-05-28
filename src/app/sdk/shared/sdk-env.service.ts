import { Injectable } from "@angular/core";
import { Environment } from "@arkecosystem/platform-sdk-profiles";

import { SdkHttpService } from "./sdk-http.service";
import { SdkStorageService } from "./sdk-storage.service";

@Injectable({ providedIn: "root" })
export class SdkEnvironment {
	private environment: Environment;

	constructor(
		sdkHttpService: SdkHttpService,
		sdkStorageService: SdkStorageService,
	) {
		this.environment = new Environment({
			httpClient: sdkHttpService,
			storage: sdkStorageService,
		});
	}

	public profiles() {
		return this.environment.profiles();
	}

	public data() {
		return this.environment.data();
	}

	public settings() {
		return this.environment.settings();
	}
}
