import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPolicies } from './view-policies';

describe('ViewPolicies', () => {
  let component: ViewPolicies;
  let fixture: ComponentFixture<ViewPolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPolicies],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPolicies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
