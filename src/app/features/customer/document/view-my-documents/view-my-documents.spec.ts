import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMyDocuments } from './view-my-documents';

describe('ViewMyDocuments', () => {
  let component: ViewMyDocuments;
  let fixture: ComponentFixture<ViewMyDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyDocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMyDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
