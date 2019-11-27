import { Component, Input, HostBinding, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'empty-list',
  templateUrl: 'empty-list.html',
  styleUrls: ['empty-list.scss']
})
export class EmptyListComponent {

  @Input() message: string;
  @Output() onClickButton = new EventEmitter();

  constructor() {}

  submit() {
    this.onClickButton.emit();
  }

}
