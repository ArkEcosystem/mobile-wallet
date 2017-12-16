import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AddressMap } from '@models/contact';

@Component({
  selector: 'address-list',
  templateUrl: 'address-list.html'
})
export class AddressListComponent {
  @Input() map: AddressMap[];
  @Input() icon: string;
  @Input() circleProperty: string = 'key'; // key or value

  @Output() onTap: EventEmitter<string> = new EventEmitter<string>();
  @Output() onPress: EventEmitter<string> = new EventEmitter<string>();
  @Output() onMore: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  tap(key: string) {
    this.onTap.emit(key);
  }

  press(key: string) {
    this.onPress.emit(key);
  }

  more() {
    this.onMore.emit();
  }

}
