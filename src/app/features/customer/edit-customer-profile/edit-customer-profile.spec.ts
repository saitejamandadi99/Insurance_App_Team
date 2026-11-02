import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCustomerProfile } from './edit-customer-profile';

describe('EditCustomerProfile', () => {
  let component: EditCustomerProfile;
  let fixture: ComponentFixture<EditCustomerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCustomerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCustomerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
