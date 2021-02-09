import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class BaseReportService extends DataService {
  /**
   * base Url for report service api
   */
  baseUrl: string;
  /**
   * reference of config service. 
   */
  public config: ConfigService;
  /**
   * reference of http client.
   */
  public http: HttpClient;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.REPORT_PREFIX;
  }
}
