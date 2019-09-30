import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertProcessingIndexComponent } from './convert-processing-index.component';

describe('ConvertProcessingIndexComponent', () => {
  let component: ConvertProcessingIndexComponent;
  let fixture: ComponentFixture<ConvertProcessingIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertProcessingIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertProcessingIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
