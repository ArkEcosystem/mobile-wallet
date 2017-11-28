import { Injectable } from '@angular/core';
import wif from 'wif';
import bip38 from 'bip38';
import { PrivateKey, Network } from 'ark-ts';

@Injectable()
export class ForgeProvider {

  private scryptParams = {N: 4096, r: 8, p: 8};

  constructor() { }

  public encrypt(wif: string, password: string, network: Network): string {
    let key = PrivateKey.fromWIF(wif, network);

    return bip38.encrypt(key.hash, key.getPublicKey().isCompressed, password, null, this.scryptParams);
  }

  public decrypt(encryptedKey: string, password: string, network: Network): string {
    let decrypted = bip38.decrypt(encryptedKey, password, null, this.scryptParams);

    let wifString = wif.encode(network.wif, decrypted.privateKey, decrypted.compressed);

    return wifString;
  }

}
