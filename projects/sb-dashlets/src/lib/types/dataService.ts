import { Type } from "@angular/core";
import { IApiConfig } from "./IBase";

type apiConfig = {
    method: string;
    url: string;
    options: Partial<IApiConfig>
}

export interface IDataService {
    fetchData(config: apiConfig)
}

export interface IDashletsConfig {
    dataService: Type<IDataService>;
}