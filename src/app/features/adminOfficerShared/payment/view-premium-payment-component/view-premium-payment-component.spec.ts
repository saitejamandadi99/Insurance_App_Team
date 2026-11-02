import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPremiumPaymentComponent } from './view-premium-payment-component';

describe('ViewPremiumPaymentComponent', () => {
  let component: ViewPremiumPaymentComponent;
  let fixture: ComponentFixture<ViewPremiumPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPremiumPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPremiumPaymentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
