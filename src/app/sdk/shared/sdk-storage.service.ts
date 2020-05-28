import { Injectable } from "@angular/core";
import { Storage as StorageInterface } from "@arkecosystem/platform-sdk-profiles/dist/contracts";
import { Storage } from "@ionic/storage";
import { from, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class SdkStorageService implements StorageInterface {
	#snapshot: object | undefined;

	constructor(private storage: Storage) {}

	public async all(): Promise<object> {
		const result: object = {};

		for (const key of await this.storage.keys()) {
			result[key] = await this.get(key);
		}

		return result;
	}

	public get<T>(key: string): Promise<T> {
		return from(this.storage.get(key))
			.pipe(map((result) => this.deserialize(result)))
			.toPromise();
	}

	public set(key: string, value: string | object): Promise<void> {
		return of(this.serialize(value))
			.pipe(switchMap((result) => this.storage.set(key, result)))
			.toPromise();
	}

	public forget(key: string): Promise<void> {
		return this.storage.remove(key);
	}

	public flush(): Promise<void> {
		return this.storage.clear();
	}

	public count(): Promise<number> {
		return this.storage.length();
	}

	public async snapshot(): Promise<void> {
		this.#snapshot = await this.all();
	}

	public async restore(): Promise<void> {
		if (!this.#snapshot) {
			throw new Error("There is no snapshot to restore.");
		}

		await this.flush();

		for (const [key, value] of Object.entries(this.#snapshot)) {
			await this.set(key, value);
		}
	}

	private serialize(value: any): string {
		return JSON.stringify(value);
	}

	private deserialize(value: any): any {
		return JSON.parse(value);
	}
}
