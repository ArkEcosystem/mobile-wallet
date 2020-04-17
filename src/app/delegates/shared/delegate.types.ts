import { Observable } from "rxjs";

export interface Delegate {
	address?: string;
	rank: number;
	username: string;
	votes?: string;
}

export interface IDelegateService {
	getDelegate: (id: string) => Observable<Delegate>;
	getDelegates: (query?: any) => Observable<Delegate[]>;
}
