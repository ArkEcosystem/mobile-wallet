import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { StorageService } from "@/app/core/storage.service";

import { SettingsConfig } from "../settings.config";
import { SettingsStateModel } from "./settings.type";

@Injectable()
export class SettingsService {
	constructor(private storageService: StorageService) {}

	public save(payload: SettingsStateModel): Observable<void> {
		return this.storageService.set(SettingsConfig.TOKEN, payload);
	}

	public load(): Observable<Partial<SettingsStateModel>> {
		return this.storageService.getObject(SettingsConfig.TOKEN);
	}

	public clear(): Observable<void> {
		return this.storageService.clear();
	}
}
