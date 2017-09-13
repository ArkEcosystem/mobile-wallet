import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Crypto } from 'ark-ts/utils';

@IonicPage()
@Component({
  selector: 'page-wallet-generate-entropy',
  templateUrl: 'wallet-generate-entropy.html',
})
export class WalletGenerateEntropyPage {

  public pan: number = 0;
  public progress: number = 0;

  private bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  private entropy = this.bytes;

  private turns: number = 20 + parseInt(Number(Math.random() * 10).toString());
  private count: number = 0;
  private total: number = this.turns * this.bytes.length;

  private finished: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  panEvent(e) {
    this.pan++;

    if (e.isFinal || e.isFirst) return;

    if (true) {
      let pos;
      let available = [];

      for (let i in this.bytes) {
        if (!this.bytes[i]) {
          available.push(i);
        }
      }

      if (!available.length) {
        this.bytes = this.bytes.map(v => 0);
        pos = parseInt(Math.random().toString()) * this.bytes.length;
      } else {
        pos = available[parseInt(Math.random().toString()) * available.length];
      }

      this.count++;

      this.bytes[pos] = 1;

      this.entropy[pos] = Crypto.randomSeed(1)[0];
      this.progress = parseInt(Number(this.count / this.total * 100).toString());

      if (this.count > this.total) {
        if (this.finished) return;

        let hex = this.entropy.map(v => this.lpad(v.toString(16), '0', 2)).join('');
        this.navCtrl.push('WalletCreatePage', { entropy: hex });

        this.finished = true;
      }
    }

  }

  lpad(str, pad, length) {
    while (str.length < length) str = pad + str
    return str
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletGenerateEntropyPage');
  }

}
