import { Component, Input, HostBinding, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'empty-list',
  templateUrl: 'empty-list.html'
})
export class EmptyListComponent {

  @Input() message: string;
  @Output() onClickButton = new EventEmitter();

  @HostBinding('class') classes = 'full-height';

  constructor() {}

  submit() {
    this.onClickButton.emit();
  }

}
