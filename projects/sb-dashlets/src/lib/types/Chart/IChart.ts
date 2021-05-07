import { EventEmitter } from "@angular/core";
import { IBase, IFilterConfig, IReportType } from "../IBase";
import { ChartType } from './IChartType'

export interface IChartBase extends IBase {
  type: ChartType;
  config: object
  readonly _defaultConfig: object
  chartBuilder(config, data);
}

export interface IChart extends IChartBase {
  readonly _defaultConfig: Partial<IChartOptions>;
  config: Partial<IChartOptions>;
  refreshChart();
  addData(data: object | object[]);
  removeData(label: string);
  getTelemetry();
  getCurrentSelection();
  getDatasetAtIndex(index: number);
}


export type IChartOptions = {
  labels: string[],
  labelExpr: string;
  datasets: IDataset[];
  tooltip: object;
  legend: object | boolean;
  animation: object;
  colors: object | object[];
  title: string | object;
  description: string;
  subtitle: string;
  caption: object;
  filters: IFilterConfig;
  responsive: boolean;
  type: string;
  scales: {
    axes: any;
    [key: string]: any;
  };
  [key: string]: any;
};

export type IDataset = {
  label: string;
  dataExpr?: string;
  data?: any[];
  [key: string]: any;
}
