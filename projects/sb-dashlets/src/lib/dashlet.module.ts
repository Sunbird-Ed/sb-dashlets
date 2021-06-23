import { NgModule } from '@angular/core';
import { DashletComponent, ChartJsComponent, BigNumberComponent, DtTableComponent, FiltersComponent, MapComponent } from './components/index';
import { ReportWrapperDirective, TemplateRefsDirective } from './directives/index';
import { HttpClientModule } from '@angular/common/http'
import { ChartsModule } from 'ng2-charts'
import { CommonModule } from '@angular/common';
import { DataTablesModule } from "angular-datatables";
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [ChartJsComponent, DashletComponent, ReportWrapperDirective, BigNumberComponent, DtTableComponent, TemplateRefsDirective, FiltersComponent, MapComponent],
  imports: [HttpClientModule, ChartsModule, CommonModule, DataTablesModule, ReactiveFormsModule, NgMultiSelectDropDownModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports: [DashletComponent, TemplateRefsDirective],
  entryComponents: [ChartJsComponent, BigNumberComponent, DtTableComponent, MapComponent]
})
export class DashletModule { }
