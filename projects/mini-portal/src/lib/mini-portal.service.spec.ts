import { TestBed } from '@angular/core/testing';

import { MiniPortalService } from './mini-portal.service';

describe('MiniPortalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MiniPortalService = TestBed.get(MiniPortalService);
    expect(service).toBeTruthy();
  });
});
