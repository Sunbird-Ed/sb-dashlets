import { EventEmitter, TemplateRef } from '@angular/core';
import { DataService } from '../../services';
import { Observable, of } from 'rxjs';
import { InputParams, IBase, IData, ReportState, IReportType, UpdateInputParams, CustomEvent } from '../../types';
import { tap } from 'rxjs/operators';
import { constants } from '../../tokens/constants';
import * as jsonexport from "jsonexport/dist"; const jsonExport = jsonexport;

export abstract class BaseComponent implements Partial<IBase> {

  constructor(protected dataService: DataService) { }

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

  exportAsCsv(data?: object[]) {
    jsonExport(data || this.data, (error, csv) => {
      if (!error && csv) {
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        this._downloadFile(url, 'data.csv');
      }
    })
  }
}
