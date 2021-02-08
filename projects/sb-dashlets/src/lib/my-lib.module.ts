import { NgModule } from '@angular/core';
import { GrapshViewComponent } from './components/graph-view/graph-view.component';
import { MyLibComponent } from './my-lib.component';
import { CommonModule } from '@angular/common';
import { DataChartComponent2 } from './components/data-chart/data-chart.component2';
import { ResourceService } from './service/resource.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ChartsModule } from 'ng2-charts';
import { ConfigService } from './service/config/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { ReportSummaryComponent } from './components/report-summary/report-summary.component';
import { UsageService } from './service/usage.service';
import { UtilityService } from './service/utility.service';
import { BaseReportService } from './service/report.service';
import {
  SuiModule, SuiUtilityModule, SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui';



@NgModule({
  declarations: [
    MyLibComponent,
    GrapshViewComponent,
    DataChartComponent2,
    ReportSummaryComponent
  ],
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    SuiProgressModule, SuiRatingModule, SuiCollapseModule,
    HttpClientModule,
    ReactiveFormsModule,
    SuiUtilityModule,
    SuiModule,
    ChartsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  exports: [GrapshViewComponent],
  providers: [
    ResourceService,
    ConfigService,
    CacheService,
    UsageService,
    BaseReportService,
    UtilityService,
    HttpClient
  ]
})
export class MyLibModule { }
