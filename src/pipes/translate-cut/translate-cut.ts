import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateCut'
})
export class TranslateCutPipe implements PipeTransform {
  transform(value: string, index: number): string {
    if (!value) {
      return value;
    }
    return value.split('|')[index];
  }
}
