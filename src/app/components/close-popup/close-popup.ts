import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'close-popup',
  templateUrl: 'close-popup.html'
})
export class ClosePopupComponent {

  @HostBinding('style.z-index') style = 1000;

  @Input('large') large: boolean;
  @Input('color') color: string;
  @Output('onClose') onClose: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  close() {
    this.onClose.emit();
  }

}
