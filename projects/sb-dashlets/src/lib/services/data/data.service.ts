import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  private cachedData = new Map();

  fetchData(config) {
    const stringifiedConfig = JSON.stringify(config);
    if (this.cachedData.has(stringifiedConfig)) return this.cachedData.get(stringifiedConfig);
    return this.httpClient.request(config).pipe(
      tap(response => {
        this.cachedData.set(stringifiedConfig, response);
      })
    );
  }
}
