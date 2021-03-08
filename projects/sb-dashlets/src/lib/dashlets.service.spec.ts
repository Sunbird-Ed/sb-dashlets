import { TestBed } from '@angular/core/testing';

import { MyLibService } from './dashlets.service';

describe('MyLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyLibService = TestBed.get(MyLibService);
    expect(service).toBeTruthy();
  });
});
