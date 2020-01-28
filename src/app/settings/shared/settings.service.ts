import { StorageService } from "@/app/shared/storage.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SETTINGS_TOKEN } from "../settings.config";
import { SettingsStateModel } from "./settings.model";

@Injectable({ providedIn: "root" })
export class SettingsService {
	constructor(private storageService: StorageService) {}

	public load(): Observable<SettingsStateModel | undefined> {
		return this.storageService.getObject(SETTINGS_TOKEN);
	}

	public clear(): Observable<void> {
		return this.storageService.clear();
	}
}
