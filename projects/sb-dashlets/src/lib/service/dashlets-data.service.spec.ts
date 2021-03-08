import { TestBed } from '@angular/core/testing';

import { DashletDataService } from './dashlets-data.service';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashletDataService = TestBed.get(DashletDataService);
    expect(service).toBeTruthy();
  });
});
