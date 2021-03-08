import { TestBed } from '@angular/core/testing';

import { DashletUsageService } from './dashlets-usage.service';

describe('UsageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashletUsageService = TestBed.get(DashletUsageService);
    expect(service).toBeTruthy();
  });
});
