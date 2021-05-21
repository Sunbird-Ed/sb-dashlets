
import { IChartBase } from './IChart';

export type IBigNumberOperations = "MIN" | "MAX" | "AVG" | "SUM";
export interface IBigNumberConfig {
  header?: string;
  footer?: string;
  dataExpr?: string;
  data?: number | string;
  operation?: IBigNumberOperations;
}

export interface IBigNumber extends IChartBase {
  config: IBigNumberConfig;
  _defaultConfig: IBigNumberConfig
}


