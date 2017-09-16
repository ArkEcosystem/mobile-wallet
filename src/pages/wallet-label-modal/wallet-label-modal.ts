import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-wallet-label-modal',
  templateUrl: 'wallet-label-modal.html',
})
export class WalletLabelModalPage {

  public label: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController,
    public ele: ElementRef,
  ) {
    this.label = this.navParams.get('label') || '';
  }

  closeModal() {
    this.viewController.dismiss();
  }

  submitForm() {
    this.viewController.dismiss(this.label);
  }

  ngAfterViewInit() {
    // Change modal size
    let claz = this.ele.nativeElement.parentElement.getAttribute('class') + ' modal-label';
    this.ele.nativeElement.parentElement.setAttribute('class', claz);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletLabelModalPage');
  }

}
