import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDocument } from './add-document';

describe('AddDocument', () => {
  let component: AddDocument;
  let fixture: ComponentFixture<AddDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDocument],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDocument);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
