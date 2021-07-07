import { IBase } from "../IBase";
import { IFilterConfig } from '../filter';
import { ChartType } from './IChartType'

export interface IChartBase extends IBase {
  type: ChartType;
  config: object
  readonly _defaultConfig: object
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
  options: object,
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
