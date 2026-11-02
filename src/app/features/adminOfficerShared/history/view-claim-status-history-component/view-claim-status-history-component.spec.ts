import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewClaimStatusHistoryComponent } from './view-claim-status-history-component';

describe('ViewClaimStatusHistoryComponent', () => {
  let component: ViewClaimStatusHistoryComponent;
  let fixture: ComponentFixture<ViewClaimStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClaimStatusHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewClaimStatusHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
