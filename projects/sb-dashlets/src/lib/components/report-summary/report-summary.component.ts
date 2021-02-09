import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '../../service/resource.service';
import { UsageService } from '../../service/usage.service';

interface ReportSummary {
  label: string;
  text: Array<string>;
  createdOn: string;
}

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {

  @Input() inputData: Array<ReportSummary>;

  constructor(public usageService: UsageService, public resourceService: ResourceService) {
    console.log('initializer new');
  }

  ngOnInit() {
    console.log('initializer');
    this.resourceService.initialize();
  }

}
