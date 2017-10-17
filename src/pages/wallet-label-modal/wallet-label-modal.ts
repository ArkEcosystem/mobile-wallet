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
    private navCtrl: NavController,
    private _navParams: NavParams,
    private _viewController: ViewController,
    private _ele: ElementRef,
  ) {
    this.label = this._navParams.get('label') || '';
  }

  closeModal() {
    this._viewController.dismiss();
  }

  submitForm() {
    this._viewController.dismiss(this.label);
  }

  ngAfterViewInit() {
    // Change modal size
    let claz = this._ele.nativeElement.parentElement.getAttribute('class') + ' modal-label';
    this._ele.nativeElement.parentElement.setAttribute('class', claz);
  }

}
