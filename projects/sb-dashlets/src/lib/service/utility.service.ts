import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsageService } from './usage.service';
import _ from 'lodash-es';

declare const iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  public iziToast: any;

  constructor(private usageService: UsageService) {
    this.iziToast = iziToast;
  }

  public fetchDataSource(filePath: string, id?: string | number): Observable<any> {
    return this.usageService.getData(filePath).pipe(
      map(configData => {
        return {
          result: _.get(configData, 'result'),
          ...(id && { id })
        };
      })
    );
  }

  error(message: string) {
    this.iziToast.error({
      title: message,
      class: 'sb-toaster sb-toast-error'
    });
  }
}
