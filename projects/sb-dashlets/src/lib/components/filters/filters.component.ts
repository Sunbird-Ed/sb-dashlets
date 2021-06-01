import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DEFAULT_CONFIG } from '../../tokens/index';
import * as _ from 'lodash-es'
import { debounceTime, distinctUntilChanged, takeUntil, map, tap, pairwise, startWith } from 'rxjs/operators';
import { Subject, zip } from 'rxjs';
import { IFilterConfig } from '../../types/index'
import { defaultValue } from './defaultConfiguration';
import * as momentImported from 'moment'; const moment = momentImported;

const ranges: any = {
  'Today': [moment(), moment()],
  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
};

const sortDates = (dates: string[], format = 'DD-MM-YYYY') => {
  return dates.sort((pre, next) => {
    const preDate = moment(pre, format), nextDate = moment(next, format);
    if (preDate.isSame(nextDate)) return 0;
    if (preDate.isBefore(nextDate)) return -1;
    return 1;
  });
}

interface AdditionalConfig {
  options?: string[];
  minDate?: any;
  maxData?: any;
  dropdownSettings: object;
  dateFormat: string;
}

export type IFilterConfiguration = IFilterConfig & AdditionalConfig

@Component({
  selector: 'sb-dashlets-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  providers: [{
    provide: DEFAULT_CONFIG,
    useValue: defaultValue
  }]
})
export class FiltersComponent implements OnInit, OnDestroy {

  @Input() config: IFilterConfig[] = [];
  @Input() data;
  @Output() filteredData = new EventEmitter();

  private _data;

  public filtersFormGroup: FormGroup;
  public filters: IFilterConfiguration[];
  public unsubscribe$ = new Subject<void>();
  public ranges = ranges;
  public locale = { applyLabel: 'Set Date', format: 'DD-MM-YYYY' };
  public dropdownSettings: any;

  @ViewChild('datePickerForFilters', { static: false }) datepicker: ElementRef;


  constructor(private fb: FormBuilder, @Inject(DEFAULT_CONFIG) private defaultConfig) { }

  ngOnInit() {
    this._data = this.data;
    this.init(this.config, this._data);
    this.handleFilterValueChanges();
  }

  private _setDropdownSettings(config: object = {}) {
    return { ...this.defaultConfig.dropdownSettings, ...config };
  }

  private _getFilterOptions(dataExpr: string, data: object[]) {
    const getFilterValue = dataExpr => row => (row && row[dataExpr]) || '';
    return _.chain(data).map(getFilterValue(dataExpr)).uniq().sortBy().compact().value();
  }

  init(config: IFilterConfig[], data: object[]) {
    this.filters = [];
    this.filtersFormGroup = this.fb.group({});
    config.forEach(filter => {
      const filterObj: IFilterConfiguration = { ...this.defaultConfig.config, ...filter };
      const { reference, default: defaultValue, searchable, controlType, dropdownSettings = {}, dateFormat } = filterObj;
      const options = this._getFilterOptions(reference, data);
      if (filter.controlType === 'date' || /date/i.test(reference)) {
        const sortedDateRange = sortDates([...options], dateFormat);
        filterObj['minDate'] = moment(sortedDateRange[0], dateFormat);
        filterObj['maxDate'] = moment(sortedDateRange[sortedDateRange.length - 1], dateFormat);
      } else {
        filterObj['dropdownSettings'] = this._setDropdownSettings({
          singleSelection: controlType === 'single-select' ? true : false,
          allowSearchFilter: searchable,
          ...dropdownSettings
        });
      }
      filterObj.options = options;
      this.filtersFormGroup.addControl(reference, this.fb.control(defaultValue));
      this.filters.push(filterObj);
    });
  }

  private _omitEmptyFilters = filters => _.omitBy(filters, _.isEmpty);

  private transformFilterValues = filters => _.mapValues(filters, values => Array.isArray(values) ? values : [values]);

  private getSelectedFiltersObservable = () => {
    return this.filtersFormGroup.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(1000),
        distinctUntilChanged(),
        map(this._omitEmptyFilters.bind(this)),
        map(this.transformFilterValues.bind(this)),
        startWith({}),
        pairwise()
      );
  }


  handleFilterValueChanges() {
    const selectedFilters$ = this.getSelectedFiltersObservable();

    const filteredData$ = selectedFilters$.pipe(
      tap(console.log),
      map(([_, currentFilters]) => currentFilters),
      map(this.filterDataBySelectedFilters(this._data))
    )

    zip(selectedFilters$, filteredData$)
      .subscribe(([[previousFilters, currentFilters], filteredData]) => {
        _.forEach(this.filters, filter => {
          const { reference } = filter;
          const options = this._getFilterOptions(reference, filteredData);
          const referenceExistsInPreviousFilters = reference in (previousFilters as object);
          const referenceExistsInCurrentFilters = reference in (currentFilters as object);
          if (!referenceExistsInCurrentFilters || (referenceExistsInPreviousFilters && JSON.stringify(previousFilters[reference]) === JSON.stringify(currentFilters[reference]))) {
            filter.options = options;
            if (filter.controlType === 'date' || /date/i.test(reference)) {
              const sortedDateRange = sortDates([...options], 'DD-MM-YYYY');
              filter['minDate'] = moment(sortedDateRange[0], 'DD-MM-YYYY');
              filter['maxDate'] = moment(sortedDateRange[sortedDateRange.length - 1], 'DD-MM-YYYY');
            }
          }
        })
        this.filteredData.emit(filteredData);
      })
  }

  filterDataBySelectedFilters(JSON) {
    return selectedFilters => _.filter(JSON, data => {
      return _.every(selectedFilters, (values, key) => {
        if (data[key]) {
          return _.some(values, value => _.trim(_.toLower(value)) === _.trim(_.toLower(data[key])));
        }
        return false;
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateDateRange({ startDate, endDate }, columnRef, dateFormat) {
    const selectedStartDate = moment(startDate).subtract(1, 'day');
    const selectedEndDate = moment(endDate).add(1, 'day');
    const dateRange = [];
    const currDate = moment(selectedStartDate).startOf('day');
    const lastDate = moment(selectedEndDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dateRange.push(currDate.clone().format(dateFormat));
    }
    this.filtersFormGroup.get(columnRef).setValue(dateRange);
  }

  reset() {
    this.filtersFormGroup.reset();
    if (this.datepicker) {
      this.datepicker.nativeElement.value = '';
    }
  }
}
