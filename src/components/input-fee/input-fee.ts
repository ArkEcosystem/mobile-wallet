import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TransactionType } from 'ark-ts';

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

  @Output()
  public onChange: EventEmitter<number> = new EventEmitter();

  public step: number;
  public v1Fee: number;
  public v2Fee: FeeStatistic;
  public rangeFee: number;
  public inputFee: string;
  public min: number;
  public max: number;
  public avg: number;
  public symbol: string;
  public isFeeLow = false;

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
        case TransactionType.SendArk:
          this.v1Fee = fees.send;
          break;
        case TransactionType.Vote:
          this.v1Fee = fees.vote;
          break;
      }
      this.max = this.v1Fee;
      if (!this.avg) {
        this.avg = this.max / 2;
        this.setRangeFee(this.avg);
      }
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
    this.emitChange();
  }

  public onInputRange() {
    let fee = ArkUtility.subToUnit(this.rangeFee);

    // Convert the fee to String to not use the exponential notation
    const parts = fee.split('e-');
    if (parts.length > 1) {
      fee = parseFloat(fee).toFixed(parseInt(parts[1]));
    }

    this.isFeeLow = this.avg > this.rangeFee;
    this.inputFee = fee;
  }

  public onInputText() {
    const arktoshi = parseInt(ArkUtility.unitToSub(this.inputFee));

    if (arktoshi !== this.rangeFee) {
      this.rangeFee = arktoshi;
    }

    this.emitChange();
  }

  public emitChange() {
    this.onChange.next(this.rangeFee);
  }
}
