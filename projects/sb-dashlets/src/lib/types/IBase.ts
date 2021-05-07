import { EventEmitter } from "@angular/core";

export enum IReportType {
  CHART = "chart",
  TABLE = "table"
}

export type InputParams = {
  type: string;
  config: object;
  data: IData
}

export type UpdateInputParams = Omit<InputParams, "data"> & { data: object[] };

export enum ReportState {
  PENDING = "pending",
  DONE = "done"
}

export type CustomEvent = {
  type: string;
  event: any
}
export interface IBase {
  reportType: IReportType;
  readonly _defaultConfig: object;
  height: string;
  width: string;
  id: string;
  config: object;
  data: object[];
  state: EventEmitter<ReportState>;
  events: EventEmitter<CustomEvent>;
  initialize(config: InputParams): void;
  reset(): void;
  destroy(): void;
  update(input: UpdateInputParams);
  fetchData(config: IData);
}

export type methodType = "GET" | "POST";
export interface IApiConfig {
  url: string;
  body: object | null;
  headers?: {
    [header: string]: string | string[];
  };
  methodType: methodType;
  params?: {
    [param: string]: string | string[];
  };
  response: {
    path: string;
  }
}
export interface IDataSchema {
  type: string,
  enum?: string[],
  default?: string,
  format?: string;
  items?: IDataSchema
}
export interface IData {
  values?: unknown[];
  location?: {
    apiConfig?: IApiConfig;
    url?: string;
  },
  dataSchema?: {
    [key: string]: IDataSchema;
  }
}
export interface IFilterConfig {
  reference: string;
  label: string;
  placeholder: string;
  controlType: "single-select" | "multi-select" | "date";
  searchable?: boolean;
  filters: IFilterConfig[];
  default?: string;
}

export type StringObject = { [key: string]: string };
