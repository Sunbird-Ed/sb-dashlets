import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs";
import { ResourceService } from "../../service/resource.service";

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
        public resourceService: ResourceService
    ) {}

    passOnEventEmitted($event) {
        this.openAddSummaryModal.emit($event);
    }


}