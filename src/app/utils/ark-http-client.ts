// import crossFetch from 'cross-fetch';
import { Injectable } from "@angular/core";
import { HTTP } from "@ionic-native/http/ngx";
import { from, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class HttpClient {
	// private static http: HTTP;

	// private client: any;

	// constructor(host: string, httpClient: HttpClient) {
	// 	this.client = ;
	// }

	constructor(private http: HTTP) {}
	// constructor() {
	// 	console.log('asdasdsad');
	// }

	get<T>(url: string, options: any = {}): Observable<any> {
		console.log("HttpClient#get", url);

		return from(this.http.get(url, {}, options.headers ?? {}))
			.pipe(
				map(function (result): any {
					console.log(
						"HttpClient#get result",
						result,
						JSON.parse(result.data),
					);

					return JSON.parse(result.data);
				}),
			)
			.pipe(
				catchError(function (error): any {
					console.log("HttpClient#get error", error);
				}),
			);
		// return this.request('GET', url);
	}

	post<T>(url: string, body: any = {}, options: any = {}): Observable<any> {
		console.log("HttpClient#post", url, body);

		return from(this.http.post(url, body, options.headers ?? {}))
			.pipe(
				map(function (result): any {
					console.log(
						"HttpClient#post result",
						result,
						JSON.parse(result.data),
					);

					return JSON.parse(result.data);
				}),
			)
			.pipe(
				catchError(function (error): any {
					console.log("HttpClient#post error", error);
				}),
			);
	}

	put<T>(url: string, body: any = {}, options: any = {}): Observable<any> {
		console.log("HttpClient#put", url, body);

		return from(this.http.put(url, body, options.headers ?? {}))
			.pipe(
				map(function (result): any {
					console.log(
						"HttpClient#put result",
						result,
						JSON.parse(result.data),
					);

					return JSON.parse(result.data);
				}),
			)
			.pipe(
				catchError(function (error): any {
					console.log("HttpClient#put error", error);
				}),
			);
	}

	// TODO sort our body for post/put
	// request<T>(method: string, url: string, options: any = {}): Observable<any> {
	// 	console.log('HttpClient#request', method, url);

	// 	return from(this.http[method.toLowerCase()](url, {
	// 		method,
	// 		headers: {
	// 			...(options.headers ?? {}),
	// 			'Content-Type': 'application/json',
	// 		},
	// 	}))
	// 		.pipe(map(function(result): any {
	// 			console.log('HttpClient#request result', result, JSON.parse((result as HTTPResponse).data));

	// 			return JSON.parse((result as HTTPResponse).data);
	// 		}))
	// 		.pipe(catchError(function(error): any {
	// 			console.log('HttpClient#request error', error);
	// 		}));
	// }

	// request(method: string, url: string, headers?: any): Observable<any> {
	// 	return from(this.http.(method)(url, {
	// 		method,
	// 		headers: {
	// 			...headers,
	// 			'Content-Type': 'application/json',
	// 		},
	// 	}));
	// }
}
