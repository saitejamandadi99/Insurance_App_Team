import { TestBed } from '@angular/core/testing';
import { ClaimStatusHistory } from './claim-status-history';

describe('ClaimStatusHistory', () => {
  let service: ClaimStatusHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimStatusHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
