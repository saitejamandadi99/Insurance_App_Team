import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPolicyPlanComponent } from './edit-policy-plan-component';

describe('EditPolicyPlanComponent', () => {
  let component: EditPolicyPlanComponent;
  let fixture: ComponentFixture<EditPolicyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPolicyPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPolicyPlanComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
