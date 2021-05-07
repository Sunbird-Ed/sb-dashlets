import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtTableComponent } from './dt-table.component';

describe('DtTableComponent', () => {
  let component: DtTableComponent;
  let fixture: ComponentFixture<DtTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
