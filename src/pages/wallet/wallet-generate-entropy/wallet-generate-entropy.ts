import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { Crypto } from 'ark-ts/utils';

@IonicPage()
@Component({
  selector: 'page-wallet-generate-entropy',
  templateUrl: 'wallet-generate-entropy.html',
})
export class WalletGenerateEntropyPage {

  public pan: number;
  public progress: number;

  private _bytes;
  private _entropy;

  private _turns: number;
  private _count: number;
  private _total: number;

  private _finished: boolean = false;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _menuCtrl: MenuController,
  ) {
    this.reset();
    this._menuCtrl.swipeEnable(false, 'sidebarMenu');
  }

  panEvent(e) {
    this.pan++;
    if (this._finished) return;

    if (e.isFinal || e.isFirst) return;

    if (true) {
      let pos;
      let available = [];

      for (let i in this._bytes) {
        if (!this._bytes[i]) {
          available.push(i);
        }
      }

      if (!available.length) {
        this._bytes = this._bytes.map(v => 0);
        pos = parseInt(Math.random().toString()) * this._bytes.length;
      } else {
        pos = available[parseInt(Math.random().toString()) * available.length];
      }

      this._count++;

      this._bytes[pos] = 1;

      this._entropy[pos] = Crypto.randomSeed(1)[0];

      this.progress = parseInt(Number(this._count / this._total * 100).toString());

      if (this._count > this._total) {
        let hex = this._entropy.map(v => this.lpad(v.toString(16), '0', 2)).join('');
        this._navCtrl.push('WalletCreatePage', { entropy: hex });

        this._finished = true;
      }
    }

  }

  reset() {
    this.pan = 0;
    this.progress = 0;
    this._bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._entropy = this._bytes;
    this._turns = 20 + parseInt(Number(Math.random() * 10).toString());
    this._count = 0;
    this._total = this._turns * this._bytes.length;
    this._finished = false;
  }

  lpad(str, pad, length) {
    while (str.length < length) str = pad + str
    return str
  }

  ionViewDidLeave() {
    this.reset();
  }

}
