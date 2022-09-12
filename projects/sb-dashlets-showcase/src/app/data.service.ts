import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { IDataService } from "sb-dashlets/lib";

@Injectable({
    providedIn: 'root'
})
export class DataService implements IDataService {

    constructor(private httpClient: HttpClient) { }

    private cachedData = new Map();

    fetchData(config) {
        const stringifiedConfig = JSON.stringify(config);
        if (this.cachedData.has(stringifiedConfig)) return of(this.cachedData.get(stringifiedConfig));
        const { method, url, options } = config;
        return this.httpClient.request(method, url, options).pipe(
            tap(response => {
                this.cachedData.set(stringifiedConfig, response);
            })
        );
    }

    fetchGeoJSONFile(path: string) {
        return this.fetchData({ method: 'GET', url: `/${path}`, options: {} })
    }
}