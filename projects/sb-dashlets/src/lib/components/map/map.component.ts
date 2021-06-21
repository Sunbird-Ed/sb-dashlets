import { Component, Inject } from '@angular/core';
import { DataService } from '../../services/index';
import { IReportType, InputParams, IBigNumberConfig, ChartType, UpdateInputParams, StringObject, ReportState } from '../../types/index';
import { BaseComponent } from '../base/base.component';
import { DEFAULT_CONFIG as DEFAULT_CONFIG_TOKEN, DASHLET_CONSTANTS } from '../../tokens/index';
import { } from './defaultConfiguration';
@Component({
  selector: 'sb-big-number',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [
    {
      provide: DEFAULT_CONFIG_TOKEN,
      useValue: {}
    }
  ]
})
export class MapComponent extends BaseComponent {

  public config: any;
  public reportType: IReportType = IReportType.CHART;
  public type: ChartType = ChartType.MAP;
  public _defaultConfig: object;
  public inputParameters: object = {};
  public exportOptions = ['csv'];

  constructor(protected dataService: DataService, @Inject(DEFAULT_CONFIG_TOKEN) defaultConfig: object, @Inject(DASHLET_CONSTANTS) private CONSTANTS: StringObject) {
    super(dataService);
    this._defaultConfig = defaultConfig;
  }

  async initialize({ config, data, type = ChartType.MAP }: InputParams): Promise<any> {
    if (!(config && data)) throw new SyntaxError(this.CONSTANTS.INVALID_INPUT);
    this.config = config = { ...config, type };
    const fetchedJSON = this.data = await this.fetchData(data).toPromise().catch(err => []);
    this.builder(config as IBigNumberConfig, fetchedJSON);
    this._isInitialized = true;
    this.state.emit(ReportState.DONE);
  }

  builder(config: object, JSONData) {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  reset(): void {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  destroy(): void {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  update(input: Partial<UpdateInputParams>) {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  addData(data: object | object[]) {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  refreshChart() {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  getTelemetry() {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  exportAs(format: string) {
    if (!this.exportOptions.includes(format)) {
      throw new Error('given type not supported');
    }

    this.exportAsCsv();
  }
}
