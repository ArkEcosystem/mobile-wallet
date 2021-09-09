import { Injectable } from "@angular/core";
import { HTTP } from "@ionic-native/http/ngx";
import { from, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class HttpClient {
	private defaultHeaders: any = {
		"Content-Type": "application/json",
	};

	constructor(private http: HTTP) {
		this.http.setDataSerializer("json");
	}

	get<T>(url: string, options: any = {}): Observable<any> {
		console.log("HttpClient#get", url);

		return from(
			this.http.get(url, {}, options.headers ?? this.defaultHeaders),
		).pipe(
			map(function (result): any {
				console.log(
					"HttpClient#get result",
					result,
					JSON.parse(result.data),
				);

				return JSON.parse(result.data);
			}),
			catchError(function (error): any {
				console.log("HttpClient#get error", error);

				throw error;
			}),
		);
	}

	post<T>(url: string, body: any = {}, options: any = {}): Observable<any> {
		console.log("HttpClient#post", url, body);

		return from(
			this.http.post(url, body, options.headers ?? this.defaultHeaders),
		).pipe(
			map(function (result): any {
				console.log(
					"HttpClient#post result",
					result,
					JSON.parse(result.data),
				);

				return JSON.parse(result.data);
			}),
			catchError(function (error): any {
				console.log("HttpClient#post error", error);

				throw error;
			}),
		);
	}

	put<T>(url: string, body: any = {}, options: any = {}): Observable<any> {
		console.log("HttpClient#put", url, body);

		return from(
			this.http.put(url, body, options.headers ?? this.defaultHeaders),
		).pipe(
			map(function (result): any {
				console.log(
					"HttpClient#put result",
					result,
					JSON.parse(result.data),
				);

				return JSON.parse(result.data);
			}),
			catchError(function (error): any {
				console.log("HttpClient#put error", error);

				throw error;
			}),
		);
	}
}
