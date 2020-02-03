import { StorageService } from "@/app/core/storage.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthConfig } from "../auth.config";

@Injectable()
export class AuthService {
	constructor(private storage: StorageService) {}

	public getAttempts(): Observable<number> {
		return this.storage
			.get(AuthConfig.STORAGE_ATTEMPTS)
			.pipe(map(attempts => parseInt(attempts)));
	}

	public setAttempts(attempts: number) {
		return this.storage.set(AuthConfig.STORAGE_ATTEMPTS, attempts);
	}
}
