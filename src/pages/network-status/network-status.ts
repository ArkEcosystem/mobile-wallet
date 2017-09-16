import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-network-status',
  templateUrl: 'network-status.html',
})
export class NetworkStatusPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public arkApiProvider: ArkApiProvider,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
  ) { }

  load() {
    this.translateService.get('Getting data...').subscribe((translation) => {
      let loader = this.loadingCtrl.create({
        content: translation,
      });

      loader.present();
    });
  }

  ionViewDidLoad() {
    this.load();
  }

}
