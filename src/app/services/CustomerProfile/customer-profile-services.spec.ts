import { TestBed } from '@angular/core/testing';
import { CustomerprofileServices } from './customerprofile-services';

describe('CustomerprofileServices', () => {
  let service: CustomerprofileServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerprofileServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
