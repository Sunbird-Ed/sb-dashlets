import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataChartComponent2 } from './chart.component';

describe('DataChartComponent', () => {
  let component: DataChartComponent2;
  let fixture: ComponentFixture<DataChartComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataChartComponent2 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataChartComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
