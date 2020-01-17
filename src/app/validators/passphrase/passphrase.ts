import { FormGroup } from "@angular/forms";
import * as bip39 from "bip39";

export class PassphraseValidator {
	static isValid(group: FormGroup) {
		const passphrase = group.controls.controlAddressOrPassphrase.value;
		const nonBIP39 = group.controls.controlNonBIP39.value;

		const trimmedPassphrase = passphrase ? passphrase.trim() : passphrase;

		if (nonBIP39 || !passphrase) {
			return null;
		}
		const words = trimmedPassphrase.split(" ");
		if (words.length % 3 !== 0) {
			return { invalidWordNumber: true };
		}

		if (!bip39.validateMnemonic(trimmedPassphrase)) {
			return { invalidMnemonic: true };
		}

		return null;
	}
}
