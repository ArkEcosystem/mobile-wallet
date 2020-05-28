import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Contracts } from "@arkecosystem/platform-sdk";

@Injectable({ providedIn: "root" })
export class SdkHttpService implements Contracts.HttpClient {
	constructor(private httpClient: HttpClient) {}

	get(path: string, query?: object): Promise<Record<string, any>> {
		return this.httpClient
			.get(path, {
				// @ts-ignore
				params: query,
			})
			.toPromise();
	}

	post(path: string, body: object, headers?: object) {
		return this.httpClient.post(path, body, {
			// @ts-ignore
			headers,
		});
	}
}
