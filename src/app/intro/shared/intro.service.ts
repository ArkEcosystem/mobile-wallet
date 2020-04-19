import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { StorageProvider } from "@/services/storage/storage";

import { IntroConfig } from "./intro.config";

@Injectable()
export class IntroService {
	constructor(private storageProvider: StorageProvider) {}

	public load(): Observable<string> {
		return this.storageProvider.get(IntroConfig.LEGACY_STORAGE_KEY);
	}
}
