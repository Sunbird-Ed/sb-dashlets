import { TestBed } from '@angular/core/testing';

import { DashletUtilityService } from './utility.service';

describe('UtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashletUtilityService = TestBed.get(DashletUtilityService);
    expect(service).toBeTruthy();
  });
});
