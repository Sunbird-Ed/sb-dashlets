import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from '../../services/index';
import { BaseChartDirective, ThemeService } from 'ng2-charts';
import { InputParams, IReportType, IDataset, IChart, StringObject, ReportState } from '../../types/index';
import { BaseComponent } from '../base/base.component';
import { IChartOptions, ChartType, UpdateInputParams } from '../../types/index';
import { get, groupBy, mapValues, sumBy, remove } from 'lodash-es';
import { DEFAULT_CONFIG, DASHLET_CONSTANTS } from '../../tokens/index';
import { CHART_DEFAULT_CONFIG } from './defaultConfiguration'

/**
 * @dynamic
 */
@Component({
  selector: 'sb-chart-js',
  templateUrl: './chart-js.component.html',
  styleUrls: ['./chart-js.component.css'],
  providers: [
    ThemeService,
    {
      provide: DEFAULT_CONFIG,
      useValue: CHART_DEFAULT_CONFIG
    }
  ]
})
export class ChartJsComponent extends BaseComponent implements IChart, OnDestroy {

  @ViewChild(BaseChartDirective) baseChartDirective: BaseChartDirective;
  readonly reportType: IReportType = IReportType.CHART;

  public _defaultConfig: Partial<IChartOptions>;
  public config: Partial<IChartOptions>;
  public type: ChartType;
  public inputParameters: Partial<IChartOptions> = {};
  public _labelsAndDatasetsClosure: any;
  public exportOptions = ['png', 'csv', 'jpg'];

  constructor(protected dataService: DataService, @Inject(DEFAULT_CONFIG) defaultConfig: object, @Inject(DASHLET_CONSTANTS) private CONSTANTS: StringObject) {
    super(dataService);
    this._defaultConfig = defaultConfig;
  }

  /**
   * @description initializes the component with the passed config and data
   * @param {InputParams} { config, type, data }
   * @return {*}  {Promise<any>}
   * @memberof ChartJsComponent
   */
  async initialize({ config, type, data }: InputParams): Promise<any> {
    if (!(config && type && data)) throw new SyntaxError(this.CONSTANTS.INVALID_INPUT);
    this.config = config = { ...config, type };
    const fetchedJSON = this.data = await this.fetchData(data).toPromise().catch(err => []);
    this.builder(config, fetchedJSON);
    this._isInitialized = true;
    this.state.emit(ReportState.DONE);
  }

  /**
   * @description It's a high order function responsible for getting labels and datasets, addition and removal of data.
   * @private
   * @param {string} labelExpr
   * @param {IDataset[]} datasets
   * @return {*}
   * @memberof ChartJsComponent
   */
  private getLabelsAndDatasetsClosure(labelExpr: string, datasets: IDataset[]) {
    return (data: object[]) => {
      const getDataGroupedByLabelExpr = data => groupBy(data, val => {
        const value = get(val, labelExpr);
        return value && typeof value === 'string' ? value.toLowerCase().trim() : '';
      });
      const getLabels = (data: object) => Object.keys(data);
      const getDatasets = (data: object) => datasets.map(dataset => {
        return {
          ...dataset,
          ...(dataset.dataExpr && {
            data: Object.values(mapValues(data, rows => sumBy(rows, row => +(row[dataset.dataExpr] || 0))))
          })
        }
      });
      const findDataByLabelPredicate = (label: string) => (row: object) => row[labelExpr] === label;
      return {
        addData(newData: object[]) {
          data = data.concat(newData);
          return this.getData(data);
        },
        getData(overriddenData?: object[]) {
          data = overriddenData || data;
          const groupedData = getDataGroupedByLabelExpr(data);
          return {
            labels: getLabels(groupedData),
            datasets: getDatasets(groupedData)
          }
        },
        removeData(label: string) {
          remove(data, findDataByLabelPredicate(label));
          return this.getData(data);
        }
      }
    }
  }

  /**
   * @description prepared the chart data using the configuration passed
   * @param {Partial<IChartOptions>} config
   * @param {*} data
   * @memberof ChartJsComponent
   */
  builder(config: Partial<IChartOptions>, data) {
    let { labels = [], labelExpr = null, type = null, legend = true, colors = [], datasets = [], options = {}, ...others } = config;
    options = { ...others, ...options };
    if (labelExpr) {
      this._labelsAndDatasetsClosure = this.getLabelsAndDatasetsClosure(labelExpr, datasets)(data);
      const { getData } = this._labelsAndDatasetsClosure;
      ({ labels, datasets } = getData());
    }
    this.setChartData({ labels, datasets, options, type, legend, colors });
  }

  private setChartData(config: Partial<IChartOptions> = {}) {
    this.inputParameters = { ...this._defaultConfig, ...this.inputParameters, ...config };
    this.$context = { data: this.data, config: this.config, inputParameters: this.inputParameters, exportOptions: this.exportOptions };
  }

  reset(): void {
    // throw new Error('Method not implemented.');
  }

  destroy(): void {
    if (get(this.baseChartDirective, 'chart.destroy')) {
      this.baseChartDirective.chart.destroy();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**
   * @description updates the type, data or Dashlet configuration
   * @param {InputParams} input
   * @memberof ChartJsComponent
   */
  update(input: Partial<UpdateInputParams>) {
    this.checkIfInitialized();
    if (!input) throw new Error(this.CONSTANTS.INVALID_INPUT);
    const { type = null, config = {}, data = null } = input;
    let labels, datasets;
    if (data) {
      const { labelExpr, datasets: datasetsConfig } = config as { labelExpr: string, datasets: IDataset[] };
      if (labelExpr || datasets) {
        this._labelsAndDatasetsClosure = this.getLabelsAndDatasetsClosure(labelExpr || this.getConfigValue(labelExpr), datasetsConfig || this.getConfigValue(datasets))(data);
      }
      ({ labels, datasets } = this._labelsAndDatasetsClosure.getData(data));
    }
    this.setChartData({ ...config, ...(type && { type }), ...(labels && datasets && { labels, datasets }) });
    if (get(this.baseChartDirective, 'update')) {
      this.baseChartDirective.update();
    }
  }

  addData(data: object[] | object) {
    this.checkIfInitialized();
    if (!data) throw new Error(this.CONSTANTS.INVALID_INPUT);
    if (this._labelsAndDatasetsClosure) {
      data = Array.isArray(data) ? data : [data];
      const { labels, datasets } = this._labelsAndDatasetsClosure.addData(data);
      this.setChartData({ labels, datasets });
    }
  }

  refreshChart() {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  /**
   * @description Removes data associated with a label
   * @param {string} label
   * @memberof ChartJsComponent
   */
  removeData(label: string) {
    this.checkIfInitialized();
    const { labels, datasets } = this._labelsAndDatasetsClosure.removeData(label);
    this.setChartData({ labels, datasets });
  }

  getTelemetry() {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  getCurrentSelection() {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  getDatasetAtIndex(index: number) {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  onChartClicked(event) {
    this.events.emit({
      type: 'CLICK',
      event
    })
  }

  onChartHovered(event) {
    this.events.emit({
      type: 'HOVER',
      event
    })
  }

  exportAsImage(format = 'jpg') {
    const dataUrl = (document.getElementById(this.id) as any).toDataURL(`image/${format}`, 1);
    const fileName = `image.${format}`;
    this._downloadFile(dataUrl, fileName);
  }

  exportAs(format: string) {
    if (!this.exportOptions.includes(format)) {
      throw new Error('given type not supported');
    }
    switch (format) {
      case 'csv': {
        this.exportAsCsv();
        break;
      }
      default: {
        this.exportAsImage(format);
        break;
      }
    }
  }
}
