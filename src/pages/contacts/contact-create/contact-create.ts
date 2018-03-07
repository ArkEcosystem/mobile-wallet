import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';
import { ContactsProvider } from '@providers/contacts/contacts';

import { Contact, QRCodeScheme } from '@models/model';
import { PublicKey } from 'ark-ts/core';

import { QRScannerComponent } from '@components/qr-scanner/qr-scanner';

import lodash from 'lodash';
import { ToastProvider } from '@providers/toast/toast';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableObject } from '@models/translate';

@IonicPage()
@Component({
  selector: 'page-contact-create',
  templateUrl: 'contact-create.html',
})
export class ContactCreatePage {
  @ViewChild('createContactForm') createContactForm: HTMLFormElement;
  @ViewChild('qrScanner') qrScanner: QRScannerComponent;

  public isNew: boolean;

  public address: string;
  public contactName: string;

  private currentNetwork;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private contactsProvider: ContactsProvider,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private toastProvider: ToastProvider
  ) {
    const contact = this.navParams.get('contact') as Contact;
    this.address = this.navParams.get('address');

    this.isNew = lodash.isEmpty(contact);
    if (!this.isNew) {
      this.contactName = contact.name;
      this.address = contact.address;
    }

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

    if (this.isNew) {
      const existingContact = this.contactsProvider.getContactByAddress(this.address);
      if (existingContact) {
        this.showConfirmation('CONTACTS_PAGE.OVERWRITE_CONTACT',
                              {name: existingContact.name, newName: this.contactName})
            .then(() => this.contactsProvider
                            .editContact(existingContact.address, this.contactName)
                            .subscribe(this.closeAndLoadContactList, this.showErrorMessage));
      } else {
        this.contactsProvider
            .addContact(this.address, this.contactName)
            .subscribe(this.closeAndLoadContactList, this.showErrorMessage);
      }
    } else {
      this.contactsProvider
          .editContact(this.address, this.contactName)
          .subscribe(this.closeAndLoadContactList, this.showErrorMessage);
    }
  }

  private closeAndLoadContactList = (): void => {
    this.navCtrl.push('ContactListPage')
      .then(() => {
        this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1).then(() => {
          this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1);
        });
      });
  };

  private showErrorMessage = (error: TranslatableObject): void => {
    this.toastProvider.error(error, 5000);
  };

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

  private showConfirmation(titleKey: string, stringParams: Object): Promise<void> {
    return new Promise((resolve) => {
      this.translateService.get([titleKey, 'NO', 'YES'], stringParams).subscribe((translation) => {
        const alert = this.alertCtrl.create({
          subTitle: translation[titleKey],
          buttons: [
            {
              text: translation.NO,
              role: 'cancel',
              handler: () => {}
            },
            {
              text: translation.YES,
              handler: () => resolve()
            }
          ]
        });
        alert.present();
      });
    });
  }
}
