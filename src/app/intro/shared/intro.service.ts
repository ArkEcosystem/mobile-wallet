import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { StorageProvider } from "@/services/storage/storage";

import { IntroConfig } from "../intro.config";
import { IntroStateModel } from "./intro.type";

@Injectable()
export class IntroService {
	constructor(private storageProvider: StorageProvider) {}

	public load(): Observable<Partial<IntroStateModel>> {
		return this.storageProvider.get(IntroConfig.STORAGE_KEY);
	}
}
