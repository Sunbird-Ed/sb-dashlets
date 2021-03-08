import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashletConfigService } from './config/config.service';
import { DashletDataService } from './dashlets-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends DashletDataService {
  /**
   * base Url for report service api
   */
  baseUrl: string;
  /**
   * reference of config service. 
   */
  public config: DashletConfigService;
  /**
   * reference of http client.
   */
  public http: HttpClient;
  /**
   * constructor
   * @param {DashletConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: DashletConfigService, http: HttpClient) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.REPORT_PREFIX;
  }
}
