import { Injectable } from "@angular/core";

import { AsyncStorageService } from "@/services/storage/async-storage.service";

@Injectable({ providedIn: "root" })
export class SettingsService {
	constructor(private asyncStorage: AsyncStorageService) {}

	public clear(): void {
		this.asyncStorage.clear();
	}
}
