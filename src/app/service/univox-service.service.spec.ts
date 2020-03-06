import { TestBed } from '@angular/core/testing';

import { UovtxServiceService } from './uovtx-service.service';

describe('EmpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UovtxServiceService = TestBed.get(UovtxServiceService);
    expect(service).toBeTruthy();
  });
});
