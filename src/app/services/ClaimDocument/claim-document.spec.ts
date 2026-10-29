import { TestBed } from '@angular/core/testing';
import { ClaimDocument } from './claim-document';

describe('ClaimDocument', () => {
  let service: ClaimDocument;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimDocument);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
