import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { UserDataProvider } from '@providers/user-data/user-data';
import { ToastProvider } from '@providers/toast/toast';

import { Contact } from '@models/contact';
import { PublicKey } from 'ark-ts/core';

import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-contact-create',
  templateUrl: 'contact-create.html',
})
export class ContactCreatePage {
  @ViewChild('createContactForm') createContactForm: HTMLFormElement;

  public showingQrScanner: boolean = false;
  public isNew: boolean;
  public isValid: boolean = false;

  public contact: Contact;
  public address: string;

  private _network;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider,
    private qrScanner: QRScanner,
  ) {
    let param = this._navParams.get('contact');
    this.address = this._navParams.get('address');

    this.isNew = lodash.isEmpty(param);
    this.contact = this.isNew ? new Contact() : param;
    this._network = this._userDataProvider.currentNetwork;
  }

  validateAddress() {
    let validate = PublicKey.validateAddress(this.address, this._network);
    this.createContactForm.form.controls['address'].setErrors({ incorret: !validate });
    console.log(validate, this.address, this._network);
    if (validate) this.createContactForm.form.controls['address'].setErrors(null);
  }

  submitForm() {
    if (this.isNew) {
      this._userDataProvider.addContact(this.address, this.contact);
    } else {
      this._userDataProvider.editContact(this.address, this.contact);
    }

    this._navCtrl.push('ContactListPage');
  }

  scanQRCode() {
    let $this = this;
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        let scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
          qrCode = JSON.parse(qrCode);

          if (qrCode['a']) {
            $this.address = qrCode['a'];
          }

          this.qrScanner.hide();
          $this.showingQrScanner = false;
          scanSub.unsubscribe();
        });
        this.qrScanner.show();
        this.showingQrScanner = true;
      } else if (status.denied) {
        this.toastProvider.error('QR_CODE.PERMISSION_PERMANENTLY_DENIED');
      } else {
        this.toastProvider.error('QR_CODE.PERMISSION_DENIED');
      }
    })
    .catch((e: any) => console.log('Error is', e));
  }


}
