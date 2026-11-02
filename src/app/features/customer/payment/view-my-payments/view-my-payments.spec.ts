import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMyPayments } from './view-my-payments';

describe('ViewMyPayments', () => {
  let component: ViewMyPayments;
  let fixture: ComponentFixture<ViewMyPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyPayments],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMyPayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
