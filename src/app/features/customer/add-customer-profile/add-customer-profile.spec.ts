import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCustomerProfile } from './add-customer-profile';

describe('AddCustomerProfile', () => {
  let component: AddCustomerProfile;
  let fixture: ComponentFixture<AddCustomerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCustomerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
