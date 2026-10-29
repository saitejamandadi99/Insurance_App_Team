import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDocuments } from './view-documents';

describe('ViewDocuments', () => {
  let component: ViewDocuments;
  let fixture: ComponentFixture<ViewDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
