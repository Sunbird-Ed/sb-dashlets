import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashlets } from './dashlets.component';

describe('Dashlets', () => {
  let component: Dashlets;
  let fixture: ComponentFixture<Dashlets>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dashlets ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dashlets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
