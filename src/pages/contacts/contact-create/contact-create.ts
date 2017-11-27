import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { UserDataProvider } from '@providers/user-data/user-data';

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

    this._navCtrl.setRoot('ContactListPage');
  }

  scanQRCode() {
    let $this = this;
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        let scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
          console.log(qrCode);
          qrCode = JSON.parse(qrCode);
          console.log(qrCode);

          if (qrCode['a']) {
            $this.address = qrCode['a'];
          }

          this.qrScanner.hide();
          $this.showingQrScanner = false;
          console.log($this.showingQrScanner);
          scanSub.unsubscribe();
        });
        this.qrScanner.show();
        this.showingQrScanner = true;
      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there

        // TODO: Toast error
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.

        // TODO: Toast error
      }
    })
    .catch((e: any) => console.log('Error is', e));
  }


}
