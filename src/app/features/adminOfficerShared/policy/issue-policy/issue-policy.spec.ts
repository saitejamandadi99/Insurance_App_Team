import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssuePolicy } from './issue-policy';

describe('IssuePolicy', () => {
  let component: IssuePolicy;
  let fixture: ComponentFixture<IssuePolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuePolicy],
    }).compileComponents();

    fixture = TestBed.createComponent(IssuePolicy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
