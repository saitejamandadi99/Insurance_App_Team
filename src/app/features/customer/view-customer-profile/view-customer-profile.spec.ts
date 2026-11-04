import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCustomerProfile } from './view-customer-profile';

describe('ViewCustomerProfile', () => {
  let component: ViewCustomerProfile;
  let fixture: ComponentFixture<ViewCustomerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCustomerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCustomerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
