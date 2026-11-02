import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPolicyPlanComponent } from './add-policy-plan-component';

describe('AddPolicyPlanComponent', () => {
  let component: AddPolicyPlanComponent;
  let fixture: ComponentFixture<AddPolicyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPolicyPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPolicyPlanComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
