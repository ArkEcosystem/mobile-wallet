import { Component } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html',
  styleUrls: ['progress-bar.pcss'],
  inputs: ['progress'],
})
export class ProgressBarComponent {

  constructor() { }

}
