import { Injectable } from "@angular/core";
import forge from "node-forge";

@Injectable({ providedIn: "root" })
export class ForgeProvider {
	private keySize = 32; // AES-256
	private interations = 5000;

	constructor() {}

	public generateIv() {
		return forge.util.encode64(forge.random.getBytesSync(16));
	}

	public encrypt(
		message: string,
		password: string,
		address: string,
		iv: any,
	) {
		const derivedKey = forge.pkcs5.pbkdf2(
			password,
			address,
			this.interations,
			this.keySize,
		);
		const cipher = forge.cipher.createCipher("AES-CBC", derivedKey);
		cipher.start({ iv: forge.util.decode64(iv) });
		cipher.update(forge.util.createBuffer(message));
		cipher.finish();

		return forge.util.encode64(cipher.output.getBytes());
	}

	public decrypt(
		cipherText: string,
		password: string,
		address: string,
		iv: any,
	) {
		const derivedKey = forge.pkcs5.pbkdf2(
			password,
			address,
			this.interations,
			this.keySize,
		);
		const decipher = forge.cipher.createDecipher("AES-CBC", derivedKey);
		decipher.start({ iv: forge.util.decode64(iv) });
		decipher.update(
			forge.util.createBuffer(forge.util.decode64(cipherText)),
		);
		decipher.finish();

		return decipher.output.toString();
	}
}
