import { TestBed } from '@angular/core/testing';

import { UsageService } from './usage.service';

describe('UsageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsageService = TestBed.get(UsageService);
    expect(service).toBeTruthy();
  });
});
