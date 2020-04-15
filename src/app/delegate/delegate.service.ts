import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";

import { Delegate } from "./delegate.types";

@Injectable()
export class DelegateService {
	constructor() {}

	getDelegate(id: string): Observable<Delegate> {
		// TODO
		return EMPTY;
	}

	getDelegates(query?: any): Observable<Delegate[]> {
		// TODO
		return EMPTY;
	}
}
