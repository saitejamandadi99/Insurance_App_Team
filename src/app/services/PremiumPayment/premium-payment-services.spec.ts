import { TestBed } from '@angular/core/testing';
import { PremiumPaymentServices } from './premium-payment-services';

describe('PremiumPaymentServices', () => {
  let service: PremiumPaymentServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiumPaymentServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
