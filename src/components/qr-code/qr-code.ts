import { Component, Input, OnChanges } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { AccountBackup } from '@models/model';

import lodash from 'lodash';
import * as constants from '@app/app.constants';

@Component({
  selector: 'ark-qr-code',
  templateUrl: 'qr-code.html'
})
export class QRCodeComponent implements OnChanges {
  @Input() address: string;
  @Input() size: number;
  @Input() amount: number;
  @Input() label: string;
  @Input() vendorField: string;

  public value: string;

  constructor() { }

  ngOnChanges() {
    if (!this.size) this.size = 80;

    let params = this.formatParams();
    let scheme = `${constants.URI_QRCODE_SCHEME_PREFIX}${this.address}${params}`;

    this.value = JSON.parse(JSON.stringify(scheme));
  }

  private formatParams() {
    let params = [];

    if (this.label) params.push(`label=${this.label}`);
    if (this.amount) params.push(`amount=${this.amount}`);
    if (this.vendorField) params.push(`vendorField=${this.vendorField}`);

    let stringify = params.length > 0 ? `?${params.join("&")}` : '';

    return stringify;
  }
}
