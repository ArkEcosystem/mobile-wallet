import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";

import { Delegate, IDelegateService } from "./delegate.types";

@Injectable({ providedIn: "root" })
export class DelegateService implements IDelegateService {
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
