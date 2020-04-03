import { Injectable } from "@angular/core";
import bcrypt from "bcryptjs";
import { from, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { StorageProvider } from "@/services/storage/storage";

import { AuthConfig } from "./auth.config";

@Injectable()
export class AuthService {
	constructor(private storageProvider: StorageProvider) {}

	public saveMasterPassword(password: string): Observable<any> {
		const hash = bcrypt.hashSync(password, 8);

		return this.storageProvider.set(
			AuthConfig.STORAGE_MASTERPASSWORD,
			hash,
		);
	}

	public validateMasterPassword(password: string): Observable<boolean> {
		return this.storageProvider
			.get(AuthConfig.STORAGE_MASTERPASSWORD)
			.pipe(
				switchMap((master: string) =>
					from(bcrypt.compare(password, master)),
				),
			);
	}
}
