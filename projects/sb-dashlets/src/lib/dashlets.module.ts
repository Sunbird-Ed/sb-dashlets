import { NgModule } from '@angular/core';
import { GrapshViewComponent } from './components/graph-view/graph-view.component';
import { Dashlets } from './dashlets.component';
import { CommonModule } from '@angular/common';
import { DataChartComponent2 } from './components/chart/chart.component';
import { DashletResourceService } from './service/dashlets-resource.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ChartsModule } from 'ng2-charts';
import { DashletConfigService } from './service/config/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { ReportSummaryComponent } from './components/report-summary/report-summary.component';
import { DashletUsageService } from './service/dashlets-usage.service';
import { DashletUtilityService } from './service/utility.service';
import { ReportService } from './service/dashlets-report.service';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { CommonFormElementsModule } from 'common-form-elements';
import { TableViewComponent } from './components/table-view/table-view.component';
// import { AccordionModule } from '@project-sunbird/common-consumption-v8/lib/accordion/accordion.module';
// import {
//   SuiModule, SuiUtilityModule, SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
//   SuiProgressModule, SuiRatingModule, SuiCollapseModule
// } from 'ng2-semantic-ui';


@NgModule({
  declarations: [
    Dashlets,
    GrapshViewComponent,
    DataChartComponent2,
    ReportSummaryComponent,
    TableViewComponent
  ],
  imports: [
    CommonModule,
    CommonConsumptionModule,
    CommonFormElementsModule,
    // SuiModule, SuiUtilityModule,
    // SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    // SuiProgressModule, SuiRatingModule, SuiCollapseModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  exports: [
    GrapshViewComponent,
    TableViewComponent
  ],
  providers: [
    CacheService,
    DashletUsageService,
    DashletConfigService,
    DashletResourceService,
    ReportService,
    DashletUtilityService,
    HttpClient
  ]
})
export class DashletsModule { }
