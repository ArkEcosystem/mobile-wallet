import { StorageService } from "@/app/core/storage.service";
import { Injectable } from "@angular/core";
import { compare as bCompare, hash as bHash } from "bcryptjs";
import { from, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AuthPinConfig } from "./pin.config";

@Injectable()
export class AuthPinService {
	constructor(private storageService: StorageService) {}

	public hasPasswordRegisterd(): Observable<boolean> {
		return this.getHashedPassword().pipe(map(hash => !!hash));
	}

	public hasPasswordMatch(password: string): Observable<boolean> {
		return this.getHashedPassword().pipe(
			switchMap(hash => from(bCompare(password, hash))),
		);
	}

	public saveHashedPassword(password: string): Observable<void> {
		return from(bHash(password, 8)).pipe(
			switchMap(hash =>
				this.storageService.set(
					AuthPinConfig.STORAGE_MASTERPASSWORD,
					hash,
				),
			),
		);
	}

	private getHashedPassword(): Observable<string | undefined> {
		return this.storageService.get(AuthPinConfig.STORAGE_MASTERPASSWORD);
	}
}
