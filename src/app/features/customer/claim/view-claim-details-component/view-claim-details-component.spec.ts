import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewClaimDetailsComponent } from './view-claim-details-component';

describe('ViewClaimDetailsComponent', () => {
  let component: ViewClaimDetailsComponent;
  let fixture: ComponentFixture<ViewClaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClaimDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewClaimDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
