import { TestBed } from '@angular/core/testing';

import { CoreFoundationService } from './core-foundation.service';

describe('CoreFoundationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreFoundationService = TestBed.get(CoreFoundationService);
    expect(service).toBeTruthy();
  });
});
