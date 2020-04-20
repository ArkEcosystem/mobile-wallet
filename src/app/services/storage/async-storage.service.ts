import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { from, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AsyncStorageService {
	constructor(private storage: Storage) {}

	length(): Observable<number> {
		return from(this.storage.length());
	}

	getItem(key: any): Observable<any> {
		return from(this.storage.get(key));
	}

	setItem(key: any, val: any): void {
		this.storage.set(key, val);
	}

	removeItem(key: any): void {
		this.storage.remove(key);
	}

	clear(): void {
		this.storage.clear();
	}

	keys(): Observable<string[]> {
		return from(this.storage.keys());
	}
}
