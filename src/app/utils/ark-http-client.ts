import { Injectable } from "@angular/core";
import { HTTP } from "@ionic-native/http/ngx";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class HttpClient {
	private defaultHeaders: any = {
		"Content-Type": "application/json",
	};

	constructor(private http: HTTP) {}

	get<T>(url: string, options: any = {}): Observable<any> {
		this.http.setDataSerializer("json");

		return from(
			this.http.get(
				url,
				{},
				{ ...this.defaultHeaders, ...(options.headers || {}) },
			),
		).pipe(
			map(function (result): any {
				return JSON.parse(result.data);
			}),
		);
	}

	post<T>(url: string, body: any = {}, options: any = {}): Observable<any> {
		this.http.setDataSerializer("json");

		return from(
			this.http.post(url, body, {
				...this.defaultHeaders,
				...(options.headers || {}),
			}),
		).pipe(
			map(function (result): any {
				return JSON.parse(result.data);
			}),
		);
	}

	put<T>(url: string, body: any = {}, options: any = {}): Observable<any> {
		this.http.setDataSerializer("json");

		return from(
			this.http.put(url, body, {
				...this.defaultHeaders,
				...(options.headers || {}),
			}),
		).pipe(
			map(function (result): any {
				return JSON.parse(result.data);
			}),
		);
	}
}
