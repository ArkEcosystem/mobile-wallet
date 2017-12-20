import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { AccountBackup } from '@models/model';

import lodash from 'lodash';

@Component({
  selector: 'ark-qr-code',
  templateUrl: 'qr-code.html'
})
export class QRCodeComponent {
  @Input('account') account: AccountBackup;
  @Input('size') size: number = 80;

  public value: string;

  constructor() { }

  ngOnChanges() {
    const address = this.account.address;
    console.log(this.account, address);
    if (address) {
      this.value = `ark:${address}`;
      console.log('qr address', this.value);
    }
  }
}
