import { NetworkProvider } from "@/services/network/network";
import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";

@Injectable()
export class AddressValidator {
	public constructor(private networkProvider: NetworkProvider) {}

	public isValid(control: FormControl): any {
		if (!control.value) {
			return null;
		}

		if (!this.networkProvider.isValidAddress(control.value)) {
			return { invalidAddress: true };
		}

		return null;
	}
}
