import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { DashletConfigService } from './config.service';

describe('ConfigService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashletConfigService]
    });
  });

  it('should be created', inject([DashletConfigService], (service: DashletConfigService) => {
    expect(service).toBeTruthy();
  }));
});
