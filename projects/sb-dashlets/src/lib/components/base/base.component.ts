import { EventEmitter, TemplateRef } from '@angular/core';
import { DataService } from '../../services';
import { Observable, of } from 'rxjs';
import { InputParams, IBase, IData, ReportState, IReportType, UpdateInputParams, CustomEvent } from '../../types';
import { tap } from 'rxjs/operators';
import { constants } from '../../tokens/constants';
export abstract class BaseComponent implements Partial<IBase> {

  constructor(protected dataService: DataService) { }  

  id: string;
  protected _isInitialized: boolean = false;
  $context = {};
  data = [];
  abstract reportType: IReportType;
  abstract config: object;
  abstract _defaultConfig: object;
  abstract exportOptions: string[] = [];  
  templateRefs: Record<string, TemplateRef<any>>;
  
  state = new EventEmitter<ReportState>();
  events = new EventEmitter<CustomEvent>();

  /**
   * @description This variable will hold the context object passed to the template or underlying library
   * @abstract
   * @memberof BaseComponent
   */
  abstract inputParameters;

  abstract initialize(config: InputParams): Promise<any>
  abstract builder(config, data): void;
  abstract reset(): void;
  abstract destroy(): void;
  abstract update(config: UpdateInputParams);
  abstract addData(data: object);

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

}
