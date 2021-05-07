import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IApiConfig } from '../../types';

type apiConfig = {
  method: string;
  url: string;
  options: Partial<IApiConfig>
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  private cachedData = new Map();

  fetchData(config: apiConfig) {
    const stringifiedConfig = JSON.stringify(config);
    if (this.cachedData.has(stringifiedConfig)) return this.cachedData.get(stringifiedConfig);
    const { method, url, options } = config;
    return this.httpClient.request(method, url, options).pipe(
      tap(response => {
        this.cachedData.set(stringifiedConfig, response);
      })
    );
  }
}
