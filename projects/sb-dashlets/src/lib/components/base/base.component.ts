import { EventEmitter, Inject, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InputParams, IBase, IData, ReportState, IReportType, UpdateInputParams, CustomEvent, IDataService } from '../../types/index';
import { tap } from 'rxjs/operators';
import { constants } from '../../tokens/constants';
import * as jsonexport from "jsonexport/dist"; const jsonExport = jsonexport;
import { pick } from 'lodash-es';
import { DATA_SERVICE } from '../../tokens/index';

export abstract class BaseComponent implements Partial<IBase> {

  constructor(@Inject(DATA_SERVICE) protected dataService: IDataService) { }

  id: string;
  templateRefs: Record<string, TemplateRef<any>>;
  $context;
  data = [];
  protected _isInitialized: boolean = false;

  state = new EventEmitter<ReportState>();
  events = new EventEmitter<CustomEvent>();
  x
  abstract inputParameters;
  abstract reportType: IReportType;
  abstract config: object;
  abstract _defaultConfig: object;
  abstract exportOptions: string[] = [];
  abstract initialize(config: InputParams): Promise<any>
  abstract builder(config, data): void;
  abstract reset(): void;
  abstract destroy(): void;
  abstract update(config: UpdateInputParams);
  abstract addData(data: object);
  abstract exportAs(format: string);

  fetchData(config: IData): Observable<any[]> {
    const { values = null, location: { url = null, options = {}, method = 'GET' } = {} } = config || {};
    if (values) return of(values);
    if (!url) throw new Error('invalid input');
    this.state.emit(ReportState.PENDING);
    return this.dataService.fetchData({ method, url, options }).pipe(
      tap(_ => this.state.emit(ReportState.DONE))
    );
  }

  getConfigValue(key: string) {
    return this.config && this.config[key];
  }

  protected checkIfInitialized(): never | void {
    if (!this._isInitialized) {
      throw Error(constants.CHART_NOT_INITIALIZED);
    }
  }

  protected _downloadFile(url, filename) {
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.click();
  }

  getCsv(data, options) {
    return new Promise((resolve, reject) => {
      jsonExport(data, options, (error, csv) => {
        if (!error && csv) {
          resolve(csv);
        } else {
          reject(error);
        }
      })
    })
  }

  async exportAsCsv(data?: object[], options?: Record<string, any>) {
    const { columnsToPick = [], ...others } = options || {};
    const JSON = this.sortAndTransformData(data || this.data, { columnsToPick });
    try {
      const csv: any = await this.getCsv(JSON, others);
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      this._downloadFile(url, 'data.csv');
    } catch (error) {
      console.log(error);
    }
  }

  sortAndTransformData(rows: object[], { columnsToPick = [] }: { columnsToPick: string[] }) {
    if (!columnsToPick.length) return rows;
    return rows.map(row => {
      const defaultValue = columnsToPick.reduce((acc, val) => {
        acc[val] = undefined;
        return acc;
      }, {});
      return pick({ ...defaultValue, ...row }, columnsToPick);
    });
  }
}
