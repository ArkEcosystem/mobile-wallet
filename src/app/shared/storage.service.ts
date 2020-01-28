import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { from, Observable, Subject } from "rxjs";

import { isObject, isString, toString } from "lodash";
import { map, tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class StorageService {
	public onClear$: Subject<void> = new Subject<void>();

	constructor(private storage: Storage) {}

	public get(key: string): Observable<string> {
		return from(this.storage.get(key));
	}

	public getObject<T>(key: string): Observable<T> {
		return from(this.storage.get(key)).pipe(
			map(result => JSON.parse(result || "{}")),
		);
	}

	public set<T = string>(key: string, value: T): Observable<void> {
		let raw: string;

		if (isObject(value)) {
			raw = JSON.stringify(value);
		}

		if (value && !isString(value)) {
			raw = toString(value);
		}

		return from(this.storage.set(key, raw));
	}

	public clear(): Observable<void> {
		return from(this.storage.clear()).pipe(tap(() => this.onClear$.next()));
	}
}
