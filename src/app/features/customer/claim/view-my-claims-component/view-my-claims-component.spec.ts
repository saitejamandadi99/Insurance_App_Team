import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMyClaimsComponent } from './view-my-claims-component';

describe('ViewMyClaimsComponent', () => {
  let component: ViewMyClaimsComponent;
  let fixture: ComponentFixture<ViewMyClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMyClaimsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
