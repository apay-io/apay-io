import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceCurrencyModalComponent } from './choice-currency-modal.component';

describe('ChoiceCurrencyModalComponent', () => {
  let component: ChoiceCurrencyModalComponent;
  let fixture: ComponentFixture<ChoiceCurrencyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoiceCurrencyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceCurrencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
