import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[sbReportWrapper]'
})
export class ReportWrapperDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
