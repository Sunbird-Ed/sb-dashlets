import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigNumberComponent } from './big-number.component';

describe('BigNumberComponent', () => {
  let component: BigNumberComponent;
  let fixture: ComponentFixture<BigNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
