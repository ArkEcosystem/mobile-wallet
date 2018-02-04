import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ViewController } from 'ionic-angular';

import { Crypto } from 'ark-ts/utils';

@IonicPage()
@Component({
  selector: 'modal-generate-entropy',
  templateUrl: 'generate-entropy.html',
})
export class GenerateEntropyModal {

  public pan: number;
  public progress: number;

  private bytes;
  private entropy;

  private turns: number;
  private count: number;
  private total: number;

  private finished = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private viewCtrl: ViewController,
  ) {
    this.reset();
    this.menuCtrl.swipeEnable(false, 'sidebarMenu');
  }

  panEvent(e) {
    this.pan++;
    if (this.finished) { return; }

    if (e.isFinal || e.isFirst) { return; }

    let pos;
    const available = [];

    for (const i in this.bytes) {
      if (!this.bytes[i]) {
        available.push(i);
      }
    }

    if (!available.length) {
      this.bytes = this.bytes.map(() => 0);
      pos = parseInt(Math.random().toString()) * this.bytes.length;
    } else {
      pos = available[parseInt(Math.random().toString()) * available.length];
    }

    this.count++;

    this.bytes[pos] = 1;

    this.entropy[pos] = Crypto.randomSeed(1)[0];

    this.progress = parseInt(Number(this.count / this.total * 100).toString());

    if (this.count > this.total) {
      const hex = this.entropy.map(v => this.lpad(v.toString(16), '0', 2)).join('');
      this.finished = true;
      this.dismiss(hex);
    }
  }

  reset() {
    this.pan = 0;
    this.progress = 0;
    this.bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.entropy = this.bytes;
    this.turns = 4 + parseInt(Number(Math.random() * 10).toString());
    this.count = 0;
    this.total = this.turns * this.bytes.length;
    this.finished = false;
  }

  lpad(str, pad, length) {
    while (str.length < length) { str = pad + str; }
    return str;
  }

  dismiss(result?) {
    this.viewCtrl.dismiss(result);
  }

  ionViewDidLeave() {
    this.reset();
    this.menuCtrl.swipeEnable(true, 'sidebarMenu');
  }

}
