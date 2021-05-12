import { NgModule } from '@angular/core';
import { DashletComponent, ChartJsComponent, BigNumberComponent, DtTableComponent } from './components';
import { ReportWrapperDirective, TemplateRefsDirective } from './directives';
import { HttpClientModule } from '@angular/common/http'
import { ChartsModule, ThemeService } from 'ng2-charts'
import { CommonModule } from '@angular/common';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [ChartJsComponent, DashletComponent, ReportWrapperDirective, BigNumberComponent, DtTableComponent, TemplateRefsDirective],
  imports: [HttpClientModule, ChartsModule, CommonModule, DataTablesModule],
  exports: [DashletComponent, TemplateRefsDirective],
  providers: [ThemeService],
  entryComponents: [ChartJsComponent, BigNumberComponent, DtTableComponent]
})
export class DashletModule { }
