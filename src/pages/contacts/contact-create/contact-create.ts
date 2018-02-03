import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';

import { Contact, QRCodeScheme } from '@models/model';
import { PublicKey } from 'ark-ts/core';

import { QRScannerComponent } from '@components/qr-scanner/qr-scanner';

import lodash from 'lodash';
import { ToastProvider } from '@providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-contact-create',
  templateUrl: 'contact-create.html',
})
export class ContactCreatePage {
  @ViewChild('createContactForm') createContactForm: HTMLFormElement;
  @ViewChild('qrScanner') qrScanner: QRScannerComponent;

  public isNew: boolean;

  public contact: Contact;
  public address: string;
  public contactName: string;

  private currentNetwork;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider
  ) {
    const param = this.navParams.get('contact');
    this.address = this.navParams.get('address');

    this.isNew = lodash.isEmpty(param);
    this.contact = this.isNew ? new Contact() : param;
    this.contactName = this.contact.name;
    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  validateAddress() {
    const validate = PublicKey.validateAddress(this.address, this.currentNetwork);
    this.createContactForm.form.controls['address'].setErrors({ incorrect: !validate });
    if (validate) { this.createContactForm.form.controls['address'].setErrors(null); }

    return validate;
  }

  submitForm() {
    if (!this.validateAddress()) {
      return;
    }

    this.contact.name = this.contactName;
    if (this.isNew) {
      this.userDataProvider.addContact(this.address, this.contact);
    } else {
      this.userDataProvider.editContact(this.address, this.contact);
    }

    this.navCtrl.push('ContactListPage')
      .then(() => {
        this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1).then(() => {
          this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1);
        });
      });
  }

  scanQRCode() {
    this.qrScanner.open(true);
  }

  onScanQRCode(qrCode: QRCodeScheme) {
    if (qrCode.address) {
      this.address = qrCode.address;
      this.validateAddress();
    } else {
      this.toastProvider.error('QR_CODE.INVALID_QR_ERROR');
    }
  }

}
