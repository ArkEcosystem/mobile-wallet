import { StorageService } from "@/app/core/storage.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthPinConfig } from "./pin.config";

@Injectable()
export class AuthPinService {
	constructor(private storageService: StorageService) {}

	public getEncryptedPassword(): Observable<string | undefined> {
		return this.storageService.get(AuthPinConfig.STORAGE_MASTERPASSWORD);
	}
}
