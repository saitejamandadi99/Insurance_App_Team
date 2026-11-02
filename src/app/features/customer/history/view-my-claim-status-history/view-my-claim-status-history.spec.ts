import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMyClaimStatusHistory } from './view-my-claim-status-history';

describe('ViewMyClaimStatusHistory', () => {
  let component: ViewMyClaimStatusHistory;
  let fixture: ComponentFixture<ViewMyClaimStatusHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyClaimStatusHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMyClaimStatusHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
