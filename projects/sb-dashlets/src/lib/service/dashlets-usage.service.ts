import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from '../interface/http-options';
import { catchError, map } from 'rxjs/operators';
import { get } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { DashletConfigService } from './config/config.service';
import { ReportService } from './dashlets-report.service';

@Injectable({
  providedIn: 'root'
})
export class DashletUsageService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private configService: DashletConfigService,
    private baseReportService: ReportService
    ) { }

  getData(url: string, requestParam?: { params: any; }) {
    const httpOptions: HttpOptions = {
      responseType: 'json'
    };
    if (requestParam && requestParam.params) {
      httpOptions.params = requestParam.params;
    }
    return this.http.get(url, httpOptions)
      .pipe(
        map(res => {
          const result = {
            responseCode: 'OK'
          };
          result['result'] = get(res, 'result') || res;
          return result;
        })
      );
  }

  public getLatestSummary({ reportId, chartId = null, hash = null }): Observable<any> {
    // const url = `${this.configService.urlConFig.URLS.REPORT.SUMMARY.PREFIX}/${reportId}`;
    // const req = {
    //   url: chartId ? `${url}/${chartId}` : url
    // };
    // if (hash) { req.url = `${req.url}?hash=${hash}`; }
    // return this.baseReportService.get(req).pipe(
    //   map(apiResponse => get(apiResponse, 'result.summaries')),
    //   catchError(err => of([]))
    // );
    return of({});
  }

  public transformHTML(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }
}
