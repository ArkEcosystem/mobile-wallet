import { Injectable } from '@angular/core';
import forge from 'node-forge';

@Injectable()
export class ForgeProvider {

  constructor() { }

  public generateSalt() {
    return forge.util.encode64(forge.random.getBytesSync(128));
  }

  public generateIv() {
    return forge.util.encode64(forge.random.getBytesSync(16));
  }

  public encrypt(message: string, password: string, salt: any, iv: any) {
    let key = forge.pkcs5.pbkdf2(password, forge.util.decode64(salt), 4, 16);
    let cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv: forge.util.decode64(iv)});
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();

    return forge.util.encode64(cipher.output.getBytes());
  }

  public decrypt(cipherText: string, password: string, salt: string, iv: string) {
    let key = forge.pkcs5.pbkdf2(password, forge.util.decode64(salt), 4, 16);
    let decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv: forge.util.decode64(iv) });
    decipher.update(forge.util.createBuffer(forge.util.decode64(cipherText)));
    decipher.finish();

    return decipher.output.toString();
  }

}
