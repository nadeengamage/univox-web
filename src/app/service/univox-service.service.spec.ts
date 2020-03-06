import { TestBed } from '@angular/core/testing';

import { UnivoxService } from './univox-service.service';

describe('EmpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnivoxService = TestBed.get(UnivoxService);
    expect(service).toBeTruthy();
  });
});
