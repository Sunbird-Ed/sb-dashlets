import { Component, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import $ from 'jquery';
import * as datatable from 'datatables.net';
import naturalSortDataTablePlugin from './naturalSortDataTablePlugin';
import moment from 'moment';
const GRADE_HEADER = 'Grade';
import * as _ from 'lodash-es';
import { IColDefination, IDataTableOptions } from '../../interface/common';

@Component({
  selector: 'sb-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit {
    @Input() tableId: any;
    @Input() rowsData: Array<string[]>;
    @Input() headerData: string[];
    @Input() columnDefinations: IColDefination[] = [];
    @Output() rowClickEvent = new EventEmitter<any>();
    @Input() options: IDataTableOptions = {};

    ngAfterViewInit() {
        jQuery['fn']['dataTableExt'] = datatable.ext; // added dataTableExt to jquery
        naturalSortDataTablePlugin(); // adds natural sorting plugin to dataTableExt
        const columnDefs: any = [{
            'targets': 0,
            'render': (data) => {
                const date = moment(data, 'DD-MM-YYYY');
                if (date.isValid()) {
                    return `<td><span style="display:none">
                    ${moment(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
                }
                return data;
            }
        }];
        // TODO: Should be configurable, should support multi field and multi type
        const gradeIndex = _.indexOf(this.headerData, GRADE_HEADER);
        if (gradeIndex !== 1) {
            columnDefs.push({
                targets: gradeIndex, // TODO: shouldn't push to all column, only to required field
                type: 'natural'
            });
        }
        setTimeout(() => {
            const table = ($(`#${this.tableId}`).removeAttr('width') as any).DataTable({
                retrieve: true,
                'columnDefs': [
                    {
                        'targets': 0,
                        'render': (data) => {
                            const date = moment(data, 'DD-MM-YYYY');
                            if (date.isValid()) {
                                return `<td><span style="display:none">
                                ${moment(data, 'DD-MM-YYYY').format('YYYYMMDD')}</span> ${data}</td>`;
                            }
                            return data;
                        },
                    }, ...this.columnDefinations],
                'data': this.rowsData,
                searching: false,
                ...this.options
            });

            $(`#${this.tableId} tbody`).on('click', 'tr', (event) => {
                const data = table.row(event.currentTarget).data();
                this.rowClickEvent.emit(data);
            });
        }, 100);
    }
}

