import { Component } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html',
  inputs: ['progress'],
})
export class ProgressBarComponent {

  constructor() { }

}
