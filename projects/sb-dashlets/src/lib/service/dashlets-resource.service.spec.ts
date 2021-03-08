import { TestBed } from '@angular/core/testing';

import { DashletResourceService } from './dashlets-resource.service';

describe('ResourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashletResourceService = TestBed.get(DashletResourceService);
    expect(service).toBeTruthy();
  });
});
