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

  reportType: IReportType = IReportType.TABLE;
  config: object;
  _defaultConfig: typeof defaultConfiguration;
  inputParameters = {};
  exportOptions = ['csv'];

  @ViewChild(DataTableDirective, { static: false }) dataTableElement: DataTableDirective;
  private _dtClosure: any;

  constructor(protected dataService: DataService, @Inject(DEFAULT_CONFIG) defaultConfig, @Inject(DASHLET_CONSTANTS) private CONSTANTS: StringObject) {
    super(dataService);
    this._defaultConfig = defaultConfig;
  }

  async initialize({ config, type, data }: InputParams): Promise<any> {
    if (!(config && type && data)) throw new SyntaxError(this.CONSTANTS.INVALID_INPUT);
    this.config = config = { ...config, type };
    const fetchedJSON = this.data = await this.fetchData(data).toPromise().catch(err => []);
    this.tableBuilder(config, fetchedJSON);
    this._isInitialized = true;
    this.state.emit(ReportState.DONE);
  }

  ngAfterViewInit() {
    this._dtClosure = this._tableOpsClosure();
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
    this.inputParameters = {
      ...this._defaultConfig.tableLevelConfig,
      ...this.inputParameters,
      ...config
    }
  }

  reset(): void {
    throw new Error('Method not implemented.');
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

  addData(data: object | object[]) {
    const { addData } = this._dtClosure;
    if (addData && typeof addData === 'function') {
      try {
        addData.call(this._dtClosure, data);
      } catch (error) {
        console.error('addition of data failed', error);
      }
    }
  }

  private _tableOpsClosure() {
    const _getInstance = () => this.dataTableElement && this.dataTableElement.dtInstance;
    const _addData = data => instance => instance.row.add(data);

    return {
      getInstance() {
        return _getInstance();
      },
      addData(data: object | object[]) {
        this.getInstance()
          .then(_addData(data))
          .then(this.draw.bind(this))
      },
      async draw() {
        const instance = await this.getInstance();
        instance.draw();
      },
      async destroy() {
        const instance = await this.getInstance();
        instance.destroy()

      }
    }
  }

}
