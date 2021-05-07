import { Component, Inject, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DataService } from '../../services';
import { DASHLET_CONSTANTS, DEFAULT_CONFIG } from '../../tokens';
import { IReportType, InputParams, UpdateInputParams, StringObject } from '../../types';
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
export class DtTableComponent extends BaseComponent {

  reportType: IReportType = IReportType.TABLE;
  config: object;
  _defaultConfig: object;
  tableOptions = {};
  @ViewChild(DataTableDirective, { static: false }) dataTableElement: DataTableDirective;

  constructor(protected dataService: DataService, @Inject(DASHLET_CONSTANTS) private CONSTANTS: StringObject) {
    super(dataService);
  }

  async initialize({ config, type, data }: InputParams): Promise<any> {
    if (!(config && type && data)) throw new SyntaxError(this.CONSTANTS.INVALID_INPUT);
    this.config = config = { ...config, type };
    const fetchedJSON = this.data = await this.fetchData(data).toPromise().catch(err => []);
    this.tableBuilder(config, fetchedJSON);
    this._isInitialized = true;
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

  private tableBuilder(config, data) {
    const { columnConfig: columns, ...others } = config;
    this._setTableOptions({
      ...others,
      data,
      columns,
      rowCallback: this.rowClickHandler.bind(this)
    });
  }

  private _setTableOptions(config: object = {}) {
    this.tableOptions = {
      ...this._defaultConfig,
      ...this.tableOptions,
      ...config
    }
  }

  reset(): void {
    throw new Error('Method not implemented.');
  }

  destroy(): void {
    throw new Error('Method not implemented.');
  }

  update(input: UpdateInputParams) {
    this.checkIfInitialized();
    if (!input) throw new Error(this.CONSTANTS.INVALID_INPUT);
    const { config = {}, data = null } = input;
    const { columnConfig: columns, ...others } = config as any;
    this._setTableOptions({
      ...others,
      ...(data && { data }),
      ...(columns && { columns })
    });
  };

  private getTableInstance(): Promise<any> {
    return this.dataTableElement.dtInstance;
  }

  addData(data: object | object[]) {
    this.getTableInstance().then(instance => {
      instance.row.add(data);
    })
  }
}
