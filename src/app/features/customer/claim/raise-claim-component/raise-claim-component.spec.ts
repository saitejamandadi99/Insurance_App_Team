import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaiseClaimComponent } from './raise-claim-component';

describe('RaiseClaimComponent', () => {
  let component: RaiseClaimComponent;
  let fixture: ComponentFixture<RaiseClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaiseClaimComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaiseClaimComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
