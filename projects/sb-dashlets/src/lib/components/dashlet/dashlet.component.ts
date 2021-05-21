import { Component, ComponentFactoryResolver, ContentChild, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { element } from 'protractor';
import { ReportWrapperDirective, TemplateRefsDirective } from '../../directives';
import { CustomEvent, IBase, ReportState } from '../../types';
import TYPE_TO_COMPONENT_MAPPING from './type_to_component_mapping';
import { v4 as uuidv4 } from 'uuid';


type componentInstanceType = Pick<IBase, "initialize" | "events" | "state" | "id">;

const transformTemplates = (result: object, current: { slot: string, templateRef: TemplateRef<any> }) => {
  result[current.slot] = current.templateRef;
  return result;
}
@Component({
  selector: 'sb-dashlet',
  templateUrl: './dashlet.component.html',
  styleUrls: ['./dashlet.component.css']
})
export class DashletComponent implements OnInit {

  @Input() type: string;
  @Input() config: object;
  @Input() data: object;

  @Output() events = new EventEmitter();

  @ViewChild(ReportWrapperDirective, { static: true }) reportWrapper: ReportWrapperDirective;
  @ContentChildren(TemplateRefsDirective) templateRefs: QueryList<TemplateRefsDirective>;

  private _componentInstance;
  private readonly _typeToComponentMapping = Object.freeze(TYPE_TO_COMPONENT_MAPPING);
  public id: string;


  get instance() {
    return this._componentInstance;
  }
  set instance(componentInstance) {
    this._componentInstance = componentInstance;
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.id = uuidv4();
    if (!this.type && !this.config && !this.data) {
      throw new SyntaxError('Syntax Error. Please check configuration');
    }
    this.loadComponent(this.type).catch(err => {
      console.error(err);
      throw err;
    });
  }

  async loadComponent(type: string) {
    const componentResolver = this._typeToComponentMapping[type];
    if (!componentResolver) { throw new Error('Given Type not supported'); }
    const component = await componentResolver();
    this.reportWrapper.viewContainerRef.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<componentInstanceType>(component);
    const componentRef = this.reportWrapper.viewContainerRef.createComponent(componentFactory);
    const instance = this.instance = componentRef.instance;
    if (this.templateRefs.length) {
      instance['templateRefs'] = this.templateRefs.toArray().reduce(transformTemplates, {});
    }
    instance.id = this.id;
    instance.initialize({ config: this.config, type: this.type, data: this.data });
    instance.state.subscribe(this._stateEventsHandler.bind(this));
    instance.events.subscribe(this._eventsHandler.bind(this));
  }

  private _stateEventsHandler(event: ReportState) {
    this.events.emit({ type: 'STATE', event });
  }

  private _eventsHandler(event: CustomEvent) {
    this.events.emit(event);
  }

  public filter(filteredData) {
    this.instance.update({ data: filteredData });
  }
}
