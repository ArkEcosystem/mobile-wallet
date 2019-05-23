import isNil from 'lodash/isNil';
import isPlainObject from 'lodash/isPlainObject';

import { HttpParams } from '@angular/common/http';

export class HttpUtils {
  static buildQueryParams(source: Object): HttpParams {
    let target: HttpParams = new HttpParams();
    Object.keys(source).forEach((key: string) => {
      let value: any = source[key];
      if (isNil(value)) {
        return;
      }
      if (isPlainObject(value)) {
        value = JSON.stringify(value);
      } else {
        value = value.toString();
      }
      target = target.append(key, value);
    });
    return target;
  }
}
