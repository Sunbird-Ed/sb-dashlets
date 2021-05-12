import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[sbTemplateRef]'
})
export class TemplateRefsDirective {


  @Input('sbTemplateRef') slot: string;
  
  constructor(public templateRef: TemplateRef<any>) { }

}
