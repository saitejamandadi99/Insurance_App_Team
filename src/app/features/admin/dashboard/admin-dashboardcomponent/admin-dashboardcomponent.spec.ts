import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardcomponent } from './admin-dashboardcomponent';

describe('AdminDashboardcomponent', () => {
  let component: AdminDashboardcomponent;
  let fixture: ComponentFixture<AdminDashboardcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
