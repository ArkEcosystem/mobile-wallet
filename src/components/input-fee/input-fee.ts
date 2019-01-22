import { Component, OnInit, Input } from '@angular/core';
import { Fees, TransactionType } from 'ark-ts';
import BigNumber from 'bignumber.js';

import { FeeStatistic } from '@models/stored-network';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ArkUtility } from '../../utils/ark-utility';

@Component({
  selector: 'input-fee',
  templateUrl: 'input-fee.html'
})
export class InputFeeComponent implements OnInit {
  @Input()
  public transactionType: number;

  public step: number;
  public v1Fee: number;
  public v2Fee: FeeStatistic;
  public rangeFee: number;
  public inputFee: number;
  public min: number;
  public max: number;
  public avg: number;
  public symbol: string;

  constructor(
    private arkApiProvider: ArkApiProvider
  ) {
    this.step = 1;
    this.min = this.step;
    this.symbol = this.arkApiProvider.network.symbol;
  }

  ngOnInit() {
    this.prepareFeeStatistics();
  }

  public prepareFeeStatistics() {
    this.arkApiProvider.fees.subscribe(fees => {
      switch (Number(this.transactionType)) {
        case 0:
          this.v1Fee = fees.send;
          break;
      }
      this.max = this.v1Fee;
    });

    this.arkApiProvider.feeStatistics.subscribe(fees => {
      this.v2Fee = fees.find(fee => fee.type === Number(this.transactionType));
      this.avg = this.v2Fee.fees.avgFee;
      this.setRangeFee(this.avg);
    })
  }

  public setRangeFee(value: number) {
    this.rangeFee = value;
    this.onInputRange();
  }

  public onInputRange() {
    this.inputFee = ArkUtility.arktoshiToArk(this.rangeFee);
  }
}
