import { AddressCheckResultType } from '@providers/address-checker/address-check-result-type';
import { TranslatableObject } from '@models/translate';

export class AddressCheckResult {
  public icon: string;

  public constructor(public type: AddressCheckResultType, public message: TranslatableObject) {
    switch (this.type) {
      case AddressCheckResultType.Warning:
        this.icon = 'warning';
        break;
      default:
        this.icon = 'alert';
    }
  }
}
