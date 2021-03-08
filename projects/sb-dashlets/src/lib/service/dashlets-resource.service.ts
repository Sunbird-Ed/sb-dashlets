
import { of as observableOf, throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import { HttpOptions } from '../interface/http-options';
import { RequestParam, ServerResponse } from '../interface/common';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import dayjs from 'dayjs';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { DashletConfigService } from './config/config.service';
/**
 * Service to fetch resource bundle
 */
@Injectable()
export class DashletResourceService {
  // Workaround for issue https://github.com/angular/angular/issues/12889
  // Dependency injection creates new instance each time if used in router sub-modules
  /**
  * messages bundle
  */
  messages: any = {};
  /**
  * frmelmnts bundle
  */
  frmelmnts: any = {};
  /**
   * reference of config service.
   */
  public baseUrl: string;

  /**
   * Contains instance name
   */
  private _instance: string;
  // Observable navItem source
  private _languageSelected = new BehaviorSubject<any>({});
  // Observable navItem stream
  languageSelected$ = this._languageSelected.asObservable();

  public RESOURCE_CONSUMPTION_ROOT = 'result.consumption.';

  /**
   * constructor
   */
  constructor(private config: DashletConfigService, public http: HttpClient, private cacheService: CacheService,
    private translateService: TranslateService) {

    if (!this) {
      this.baseUrl = this.config.urlConFig.URLS.RESOURCEBUNDLES_PREFIX;
      try {
        this._instance = (<HTMLInputElement>document.getElementById('instance')).value;
      } catch (error) {
      }
    } else {
      this.baseUrl = this.config.urlConFig.URLS.RESOURCEBUNDLES_PREFIX;
    }
    return this;
  }
  public initialize() {
    console.log('adas  dasd asdasd asd asd');
    const range = { value: 'en', label: 'English', dir: 'ltr' };
    console.log('72');
    
    this.getResource(this.cacheService.get('portalLanguage') || 'en', range);
    this.translateService.setDefaultLang('en');
  }
  /**
   * method to fetch resource bundle
  */
  public getResource(language = 'en', range: any = {}): void {
    console.log('81', this);
    const option = {
      url: this.config.urlConFig.URLS.RESOURCEBUNDLES.ENG + '/' + language
    };
    console.log('Configuration Values', option.url);
    this.get(option).subscribe(
      (data: ServerResponse) => {
        const { creation: { messages: creationMessages = {}, frmelmnts: creationFrmelmnts = {} } = {},
          consumption: { messages: consumptionMessages = {}, frmelmnts: consumptionFrmelmnts = {} } = {} } = _.get(data, 'result') || {};
        this.messages = _.merge({}, creationMessages, consumptionMessages);
        this.frmelmnts = _.merge({}, creationFrmelmnts, consumptionFrmelmnts);
        this.getLanguageChange(range);
      },
      (err: ServerResponse) => {
      }
    );

    this.translateService.use(language);
  }
  get(requestParam: RequestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };
    console.log('Request Url', this.baseUrl);
    return this.http.get(this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }
  /**
   * @description - Function to generate HTTP headers for API request
   * @returns HttpOptions
   */
  private getHeader(): HttpOptions['headers'] {
    const _uuid = UUID.UUID();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Consumer-ID': 'X-Consumer-ID',
      'X-Device-ID': 'X-Device-ID',
      'X-Org-code': '',
      'X-Source': 'web',
      'ts': dayjs().format(),
      'X-msgid': _uuid,
      'X-Request-ID': _uuid,
      'X-Session-Id': 'X-Session-Id'
    };
  }
  /**
 * get method to fetch instance.
 */
  get instance(): string {
    return _.upperCase(this._instance);
  }

  getLanguageChange(language) {
    this.translateService.use(language.value);
    this._languageSelected.next(language);
  }
}
