import { TestBed } from '@angular/core/testing';
import { PolicyPlanServices } from './policy-plan-services';

describe('PolicyPlanServices', () => {
  let service: PolicyPlanServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyPlanServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
