import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs";
import { DashletResourceService } from "../../service/dashlets-resource.service";

@Component({
    selector: 'sb-graph-view',
    templateUrl: './graph-view.component.html',
    styleUrls: ['./graph-view.component.scss']
})
export class GrapshViewComponent {
    @Input() report$: Observable<any>;
    @Input() hideElements: boolean;
    @Input() isUserReportAdmin: boolean;
    @Input() hash: string;
    @Output() openAddSummaryModal = new EventEmitter();

    constructor(
        public resourceService: DashletResourceService
    ) {}

    passOnEventEmitted($event) {
        this.openAddSummaryModal.emit($event);
    }

    ngOnInit() {
        this.report$.subscribe(console.log);
        this.resourceService.initialize();
    }


}