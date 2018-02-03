import { Injectable } from '@angular/core';

import forge from 'node-forge';

@Injectable()
export class ForgeProvider {

  private keySize = 32; // AES-256
  private interations = 5000;
  // private scryptParams = {N: 4096, r: 8, p: 8};

  constructor() { }

  public generateIv() {
    return forge.util.encode64(forge.random.getBytesSync(16));
  }

  public encrypt(message: string, password: string, address: string, iv: any) {
    const derivedKey = forge.pkcs5.pbkdf2(password, address, this.interations, this.keySize);
    const cipher = forge.cipher.createCipher('AES-CBC', derivedKey);
    cipher.start({ iv: forge.util.decode64(iv) });
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();

    return forge.util.encode64(cipher.output.getBytes());
  }

  public decrypt(cipherText: string, password: string, address: string, iv: any) {
    const derivedKey = forge.pkcs5.pbkdf2(password, address, this.interations, this.keySize);
    const decipher = forge.cipher.createDecipher('AES-CBC', derivedKey);
    decipher.start({ iv: forge.util.decode64(iv) });
    decipher.update(forge.util.createBuffer(forge.util.decode64(cipherText)));
    decipher.finish();

    return decipher.output.toString();
  }

  /* DEPRECATED: Due to the slowness on devices was replaced by pbkdf2
  public encryptBip38(wif: string, password: string, network: Network): string {
    let key = PrivateKey.fromWIF(wif, network);

    return bip38.encrypt(key.hash, key.getPublicKey().isCompressed, password, null, this.scryptParams);
  }

  public decryptBip38(encryptedKey: string, password: string, network: Network): string {
    let decrypted = bip38.decrypt(encryptedKey, password, null, this.scryptParams);

    let wifString = wif.encode(network.wif, decrypted.privateKey, decrypted.compressed);

    return wifString;
  }
  */

}
