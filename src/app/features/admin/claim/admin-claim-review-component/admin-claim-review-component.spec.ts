import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminClaimReviewComponent } from './admin-claim-review-component';

describe('AdminClaimReviewComponent', () => {
  let component: AdminClaimReviewComponent;
  let fixture: ComponentFixture<AdminClaimReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClaimReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminClaimReviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
