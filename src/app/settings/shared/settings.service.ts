import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AsyncStorageService } from "@/services/storage/async-storage.service";

import { SettingsConfig } from "../settings.config";
import { SettingsStateModel } from "./settings.type";

@Injectable()
export class SettingsService {
	constructor(private asyncStorage: AsyncStorageService) {}

	public load(): Observable<Partial<SettingsStateModel>> {
		return this.asyncStorage.getItem(SettingsConfig.TOKEN);
	}

	public clear(): void {
		this.asyncStorage.clear();
	}
}
