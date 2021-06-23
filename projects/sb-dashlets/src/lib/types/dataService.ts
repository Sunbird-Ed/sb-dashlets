import { Type } from "@angular/core";
import { IApiConfig } from "./IBase";

type ApiConfig = {
    method: string;
    url: string;
    options: Partial<IApiConfig>
}

export interface IDataService {
    fetchData(config: ApiConfig);
    fetchGeoJSONFile(path: string);
}

export interface IDashletsConfig {
    dataService: Type<IDataService>;
}