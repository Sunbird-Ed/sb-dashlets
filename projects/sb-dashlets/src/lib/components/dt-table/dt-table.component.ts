import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DataService } from '../../services';
import { DASHLET_CONSTANTS, DEFAULT_CONFIG } from '../../tokens';
import { IReportType, InputParams, UpdateInputParams, StringObject, ReportState } from '../../types';
import { BaseComponent } from '../base/base.component';
import defaultConfiguration from './defaultConfiguration';

declare var $;

@Component({
  selector: 'sb-dt-table',
  templateUrl: './dt-table.component.html',
  styleUrls: ['./dt-table.component.css'],
  providers: [
    {
      provide: DEFAULT_CONFIG,
      useValue: defaultConfiguration
    }
  ]
})
export class DtTableComponent extends BaseComponent implements AfterViewInit {

  private _dtClosure: any;

  public reportType: IReportType = IReportType.TABLE;
  public config: object;
  public _defaultConfig: typeof defaultConfiguration;
  public inputParameters = {};
  public exportOptions = ['csv'];

  @ViewChild(DataTableDirective, { static: false }) dataTableElement: DataTableDirective;

  constructor(protected dataService: DataService, @Inject(DEFAULT_CONFIG) defaultConfig, @Inject(DASHLET_CONSTANTS) private CONSTANTS: StringObject) {
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

  ngAfterViewInit() {
    this._dtClosure = this._tableOpsClosure(this.dataTableElement && this.dataTableElement.dtInstance);
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
    return { ...this._defaultConfig.columnConfig, ...column };
  }

  builder(config, data) {
    const { columnConfig, ...others } = config;
    const columns = columnConfig.map(this._addDefaultToColumn);
    this._setTableOptions({
      ...others,
      data,
      columns,
      rowCallback: this.rowClickHandler.bind(this)
    });
  }

  private _setTableOptions(config: object = {}) {
    this.inputParameters = {
      ...this._defaultConfig.tableLevelConfig,
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

  exportAs(format: string) {
    if (!this.exportOptions.includes(format)) {
      throw new Error('given type not supported');
    }
    switch (format) {
      case 'csv': {
        this.exportAsCsv();
        break;
      }
    }
  }
}
