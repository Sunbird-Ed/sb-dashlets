import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DASHLET_CONSTANTS, DATA_SERVICE, DEFAULT_CONFIG } from '../../tokens/index';
import { IReportType, InputParams, UpdateInputParams, StringObject, ReportState, IDataService } from '../../types/index';
import { BaseComponent } from '../base/base.component';
import { TABLE_DEFAULT_CONFIG } from './defaultConfiguration';
import * as jsonexport from "jsonexport/dist"; const jsonExport = jsonexport;
import { sortBy, map, get, omitBy } from 'lodash-es';


declare var $;
@Component({
  selector: 'sb-dt-table',
  templateUrl: './dt-table.component.html',
  styleUrls: ['./dt-table.component.css'],
  providers: [
    {
      provide: DEFAULT_CONFIG,
      useValue: TABLE_DEFAULT_CONFIG
    }
  ]
})
export class DtTableComponent extends BaseComponent {

  private _dtClosure: any;

  public reportType: IReportType = IReportType.TABLE;
  public config: object;
  public _defaultConfig: object;
  public inputParameters = {};
  public exportOptions = ['csv'];
  @ViewChild('filterDom', { static: false }) filter: any;

  @ViewChild(DataTableDirective) set dataTableElement(element: ElementRef | null) {
    if (!element) return;
    this._dtClosure = this._tableOpsClosure(element && element['dtInstance']);
  }

  constructor(@Inject(DATA_SERVICE) protected dataService: IDataService, @Inject(DEFAULT_CONFIG) defaultConfig, @Inject(DASHLET_CONSTANTS) private CONSTANTS: StringObject) {
    super(dataService);
    this._defaultConfig = defaultConfig;
  }

  async initialize({ config, type, data }: InputParams): Promise<any> {
    if (!(config && type && data)) throw new SyntaxError(this.CONSTANTS.INVALID_INPUT);
    this.config = config = { ...config, type };
    const fetchedJSON = this.data = await this.fetchData(data).toPromise().catch(err => []);
    this.builder(config, fetchedJSON);
    this._isInitialized = true;
    this.state.emit(ReportState.DONE);
  }

  private rowClickHandler = (row: Node, data: any[] | Object, index: number) => {
    const self = this;
    $('td', row).off('click');
    $('td', row).on('click', () => {
      this.events.emit({
        type: 'CLICK',
        event: data
      });
    });
    return row;
  }

  private _addDefaultToColumn = column => {
    return { ...this._defaultConfig['columnConfig'], ...column };
  }

  builder(config, data) {
    const { columnConfig, ...others } = config;
    const columns = columnConfig.map(this._addDefaultToColumn);
    const columnsSortedByIndex = sortBy(columns, ['index']);
    this._setTableOptions({
      ...others,
      data,
      columns: columnsSortedByIndex,
      rowCallback: this.rowClickHandler.bind(this)
    });
  }

  private _setTableOptions(config: object = {}) {
    this.inputParameters = {
      ...this._defaultConfig['tableLevelConfig'],
      ...this.inputParameters,
      ...config
    }
    this.$context = { data: this.data, config: this.config, inputParameters: this.inputParameters, exportOptions: this.exportOptions };
  }

  getRowsCount(): Promise<number> {
    return this._dtClosure && this._dtClosure.rowsCount();
  }

  // resets to the original state.
  reset(): void {
    this._dtClosure.updateData(this.data);
  }

  destroy(): void {
    const { destroy } = this._dtClosure;
    if (destroy && typeof destroy === 'function') {
      try {
        destroy.call(this._dtClosure);
      } catch (err) {
        console.error('component not destroyed', err);
      }
    }
  }

  update(input: Partial<UpdateInputParams>) {
    this.checkIfInitialized();
    if (!input) throw new Error(this.CONSTANTS.INVALID_INPUT);
    const { config = {}, data = null } = input;
    const { columnConfig: columns, ...others } = config as any;
    if (data && this._dtClosure) {
      this._dtClosure.updateData(data);
    }
    this._setTableOptions({
      ...others,
      ...(data && { data }),
      ...(columns && { columns })
    });
  };

  addRows(data: object | object[]): void {
    this.addData(data);
  }

  getRowAtIndex(index): Promise<any> {
    const { getRowAtIndex } = this._dtClosure;
    if (getRowAtIndex) {
      return getRowAtIndex.bind(this._dtClosure, index);
    }
  }

  async removeRow(index: number) {
    const data = await this._dtClosure.getData();
    data.splice(index, 1);
    await this._dtClosure.updateData(data);
  }

  addData(data: object | object[]): void {
    const { addData } = this._dtClosure;
    if (addData && typeof addData === 'function') {
      try {
        addData.call(this._dtClosure, data);
      } catch (error) {
        console.error('addition of data failed', error);
      }
    }
  }

  private _tableOpsClosure(tableInstance) {
    return {
      get instance() {
        return tableInstance;
      },
      async addData(data: object | object[]) {
        const instance = await this.instance;
        instance.row.add(data);
        instance.draw();
      },
      async draw() {
        const instance = await this.instance;
        instance.draw();
        return instance;
      },
      async destroy() {
        const instance = await this.instance;
        instance.destroy();
        return instance;
      },
      async updateData(data) {
        const instance = await this.instance;
        instance.clear();
        instance.rows.add(data);
        instance.draw();
      },
      async rowsCount() {
        const instance = await this.instance;
        return instance.rows().count();
      },
      async getData() {
        const instance = await this.instance;
        return instance.rows().data();
      },
      async getRowAtIndex(index: number) {
        const data = await this.getData();
        return data[index];
      }
    }
  }

  private _getColumnsForStrictMode() {
    const columnsConfig = get(this.config, 'columnConfig');
    const columnsSortedByIndex = sortBy(columnsConfig, 'index');
    const omitHiddenColumns = omitBy(columnsSortedByIndex, col => get(col, 'visible') === false);
    return omitHiddenColumns;
  }

  // Returns the csv string for the mobile platform
  async exportCsv(options = {}) {
    let JSON = await this._dtClosure.getData();
    if (options && options['strict']) {
      const columnsConfig = this._getColumnsForStrictMode();
      const columnsToPick = map(columnsConfig, 'data');
      const headersMapping = map(columnsConfig, 'title');
      options['rename'] = headersMapping;
      JSON = this.sortAndTransformData(JSON || this.data, { columnsToPick });
    }
    return this.getCsv((JSON && JSON.toArray()) || this.data, options);
  }

  async exportAs(format: string, options = {}) {
    if (!this.exportOptions.includes(format)) {
      throw new Error('given type not supported');
    }
    const data = await this._dtClosure.getData();
    switch (format) {
      case 'csv': {
        if (options && options['strict']) {
          const columnsConfig = this._getColumnsForStrictMode()
          const headersMapping = map(columnsConfig, 'title');
          const columnsToPick = map(columnsConfig, 'data');
          options['rename'] = headersMapping;
          options['columnsToPick'] = columnsToPick;
        }
        this.exportAsCsv(data && data.toArray(), options);
        break;
      }
    }
  }
  public resetFilters(){
    if(this.filter){
      this.filter.reset();
    }
  }
}
