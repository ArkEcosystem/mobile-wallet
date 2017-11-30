import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'close-popup',
  templateUrl: 'close-popup.html'
})
export class ClosePopupComponent {

  @Input('color') color: string;
  @Output('onClose') onClose: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  close() {
    this.onClose.emit();
  }

}
