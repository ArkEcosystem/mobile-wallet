import { Component, NgZone, OnDestroy } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { AuthProvider } from '@providers/auth/auth';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/takeWhile';

import { TranslateService } from '@ngx-translate/core';

import moment from 'moment';
import lodash from 'lodash';

import * as constants from '@app/app.constants';

@IonicPage()
@Component({
  selector: 'modal-pin-code',
  templateUrl: 'pin-code.html',
  providers: [Vibration],
})
export class PinCodeModal implements OnDestroy {

  public message: string;
  public password: string;
  public isWrong = false;

  public unlockDiff = 0;
  public unlockCountdown$: Subscription;

  // Send a password created before, useful for create pin and confirm
  private expectedPassword: string;
  // Will send back the entered password
  private outputPassword = false;
  // Check if the entered password is correct
  private validatePassword = false;

  private length = 6;
  private attempts = 0;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private authProvider: AuthProvider,
    private zone: NgZone,
    private vibration: Vibration,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
  ) {
    this.password = '';
    this.message = this.navParams.get('message');
    this.expectedPassword = this.navParams.get('expectedPassword');
    this.outputPassword = this.navParams.get('outputPassword') || false;
    this.validatePassword = this.navParams.get('validatePassword') || false;
  }

  add(value: number) {
    if (this.unlockDiff > 0) {
      return;
    }

    if (this.password.length < this.length) {
      this.zone.run(() => {
        this.password = this.password + value;
      });

      // When the user reach the password length
      if (this.password.length === this.length) {

        // New password
        if (!this.expectedPassword && !this.validatePassword) {
          if (this.authProvider.isWeakPassword(this.password) ) {
            // Show message about weak PIN
            this.translateService.get([
                'PIN_CODE.WEAK_PIN',
                'PIN_CODE.WEAK_PIN_DETAIL',
                'NO',
                'YES'
              ]).subscribe((translation) => {
                const alert = this.alertCtrl.create({
                  title: translation['PIN_CODE.WEAK_PIN'],
                  message: translation['PIN_CODE.WEAK_PIN_DETAIL'],
                  buttons: [{
                    text: translation.NO,
                    handler: () => {
                      this.password = '';
                    }
                  }, {
                    text: translation.YES,
                    handler: () => {
                      this.dismiss(true);
                    }
                  }]
                });
                alert.present();
              });
          } else {
            return this.dismiss(true);
          }
        }

        // Confirm with the previous entered password (validate new password)
        if (this.expectedPassword) {
          if (this.expectedPassword !== this.password) {
            this.setWrong();
          } else {
            this.dismiss(true);
          }
        }

        // Compare the password entered with the saved in the storage
        if (this.validatePassword) {
          this.authProvider.validateMasterPassword(this.password).subscribe((result) => {
            if (!result) {
              this.setWrong();
            } else {
              this.dismiss(true);
            }
          });
        }
      }
    }
  }

  verifyAttempts() {
    if (this.attempts >= constants.PIN_ATTEMPTS_LIMIT) {
      this.authProvider.increaseUnlockTimestamp().then(() => this.loadUnlockTime());
    }
  }

  setWrong() {
    this.vibration.vibrate(constants.VIBRATION_TIME_LONG_MS);

    this.authProvider.increaseAttempts().subscribe((newAttempts) => {
      this.attempts = newAttempts;
      this.verifyAttempts();

      this.zone.run(() => {
        this.isWrong = true;
        this.password = '';
        this.message = 'PIN_CODE.WRONG';

        setTimeout(() => this.isWrong = false, 500);
      });

    });
  }

  delete() {
    if (this.password.length > 0) {
      this.zone.run(() => {
        this.password = this.password.substring(0, this.password.length - 1);
      });
    }
  }

  dismiss(status: boolean = true) {
    if (this.password.length < this.length) {
      return this.viewCtrl.dismiss();
    }

    // When logged in, the attempts are restarted
    if (status) {
      this.authProvider.clearAttempts();
    }

    if (this.outputPassword) {
      this.viewCtrl.dismiss(this.password);
      return;
    }

    this.viewCtrl.dismiss(status);
  }

  private loadUnlockTime() {
    this.authProvider.getUnlockTimestamp().subscribe((timestamp) => {
      if (!timestamp || lodash.isEmpty(timestamp)) {
        return;
      }

      // If an unlock time is set in storage
      // Check if this time has already been spent
      const now = moment.now();
      const diff = moment(timestamp).diff(now, 'seconds');

      if (diff <= 0) {
        this.authProvider.clearAttempts();
        this.attempts = 0;
        return this.loadUnlockTime();
      }

      this.unlockDiff = diff;

      this.password = '';
      this.message = 'PIN_CODE.WRONG_PIN_MANY_TIMES';

      // Start the countdown
      this.unlockCountdown$ = Observable.timer(0, 1000)
                                        .map(x => this.zone.run(() => this.unlockDiff--))
                                        .takeWhile(() => this.unlockDiff > 0)
                                        .finally(() => this.zone.run(() => this.message = 'PIN_CODE.DEFAULT_MESSAGE'))
                                        .subscribe();
    });
  }

  ionViewDidLoad() {
    this.authProvider.getAttempts().subscribe((attempts) => this.attempts = attempts);
    this.loadUnlockTime();
  }

  ngOnDestroy() {
    if (this.unlockCountdown$) {
      this.unlockCountdown$.unsubscribe();
    }
  }

}
