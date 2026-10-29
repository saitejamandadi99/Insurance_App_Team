import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMyPolicies } from './view-my-policies';

describe('ViewMyPolicies', () => {
  let component: ViewMyPolicies;
  let fixture: ComponentFixture<ViewMyPolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyPolicies],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMyPolicies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
