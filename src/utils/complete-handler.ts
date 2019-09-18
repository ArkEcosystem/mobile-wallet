import { Subscriber } from 'rxjs/Subscriber';

export class CompleteHandler<T> {
  private currentNumberOfAsyncCalls = 0;
  private isComplete: boolean;
  private softCompleteObject: any;

  public constructor(private observer: Subscriber<T>,
                     private totalNumberOfAsyncCalls: number) {
  }

  public complete(obj?: any): void {
    if (this.isComplete) {
      return;
    }

    this.observer.next(obj);
    this.observer.complete();
    this.isComplete = true;
  }

  public softComplete(obj?: any): void {
    if (this.isComplete) {
      return;
    }

    if (++this.currentNumberOfAsyncCalls < this.totalNumberOfAsyncCalls) {
      return;
    }

    this.observer.next(this.softCompleteObject ? this.softCompleteObject : obj);
    this.observer.complete();
    this.isComplete = true;
  }

  public completeAsLast(obj?: any): void {
    this.softCompleteObject = obj;
    this.softComplete();
  }
}
