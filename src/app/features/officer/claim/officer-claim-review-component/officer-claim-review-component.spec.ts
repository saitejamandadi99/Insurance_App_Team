import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficerClaimReviewComponent } from './officer-claim-review-component';

describe('OfficerClaimReviewComponent', () => {
  let component: OfficerClaimReviewComponent;
  let fixture: ComponentFixture<OfficerClaimReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerClaimReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfficerClaimReviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
