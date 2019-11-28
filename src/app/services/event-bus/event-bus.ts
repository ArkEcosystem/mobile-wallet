import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class EventBusProvider {
  public $subject: Subject<{ key: string, data?: any }> = new Subject();

  emit(key: string, data?: any) {
    this.$subject.next({ key, data })
  }
}