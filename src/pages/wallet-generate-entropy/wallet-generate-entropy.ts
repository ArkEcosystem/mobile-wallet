import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Crypto } from 'ark-ts/utils';

@IonicPage()
@Component({
  selector: 'page-wallet-generate-entropy',
  templateUrl: 'wallet-generate-entropy.html',
})
export class WalletGenerateEntropyPage {

  public pan: number;
  public progress: number;

  private bytes;
  private entropy;

  private turns: number;
  private count: number;
  private total: number;

  private finished: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.reset();
  }

  panEvent(e) {
    this.pan++;
    if (this.finished) return;

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
        let hex = this.entropy.map(v => this.lpad(v.toString(16), '0', 2)).join('');
        this.navCtrl.push('WalletCreatePage', { entropy: hex });

        this.finished = true;
      }
    }

  }

  reset() {
    this.pan = 0;
    this.progress = 0;
    this.bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.entropy = this.bytes;
    this.turns = 20 + parseInt(Number(Math.random() * 10).toString());
    this.count = 0;
    this.total = this.turns * this.bytes.length;
    this.finished = false;
  }

  lpad(str, pad, length) {
    while (str.length < length) str = pad + str
    return str
  }

  ionViewDidLeave() {
    this.reset();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletGenerateEntropyPage');
  }

}
