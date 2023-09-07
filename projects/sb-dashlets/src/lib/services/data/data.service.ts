import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, pluck, retry, tap } from 'rxjs/operators';
import { IApiConfig, IDataService } from '../../types/index';

type apiConfig = {
  method: string;
  url: string;
  options: Partial<IApiConfig>
}
@Injectable({
  providedIn: 'root'
})
export class DataService implements IDataService {

  constructor(private httpClient: HttpClient) { }

  private cachedData = new Map();

  /**
   * @description fetches the dataSources using the api configuration
   * @param {apiConfig} config
   * @return {*} 
   * @memberof DataService
   */
  fetchData(config: apiConfig) {
    const stringifiedConfig = JSON.stringify(config);
    if (this.cachedData.has(stringifiedConfig)) return of(this.cachedData.get(stringifiedConfig));
    const { method, url, options } = config;
    return this.httpClient.request(method, url, options).pipe(
      tap(response => {
        this.cachedData.set(stringifiedConfig, response);
      })
    );
  }
  /**
   * @description method is used to fetch the geoJSON files. Can be overridden by the client to use the necessary endpoint
   * @param {string} path
   * @return {*} 
   * @memberof DataService
   */
  fetchGeoJSONFile(path: string) {
    return this.fetchData({ method: 'GET', url: `/reports/fetch/${path}`, options: {} })
      .pipe(
        pluck('result'),
        retry(2),
        catchError(err => throwError({ errorText: 'Failed to download geoJSON file.' }))
      );
  }
}
