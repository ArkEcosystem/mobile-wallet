import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { StorageService } from "@/app/core/storage.service";

import { IntroConfig } from "../intro.config";
import { IntroStateModel } from "./intro.type";

@Injectable()
export class IntroService {
	constructor(private storageService: StorageService) {}

	public save(payload: IntroStateModel): Observable<void> {
		return this.storageService.set(IntroConfig.TOKEN, payload);
	}

	public load(): Observable<Partial<IntroStateModel>> {
		return this.storageService.getObject(IntroConfig.TOKEN);
	}
}
