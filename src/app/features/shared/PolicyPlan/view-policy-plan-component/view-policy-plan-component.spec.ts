import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPolicyPlanComponent } from './view-policy-plan-component';

describe('ViewPolicyPlanComponent', () => {
  let component: ViewPolicyPlanComponent;
  let fixture: ComponentFixture<ViewPolicyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPolicyPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPolicyPlanComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
