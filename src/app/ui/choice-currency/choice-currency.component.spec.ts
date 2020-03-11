import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceCurrencyComponent } from './choice-currency.component';

describe('ChoiceCurrencyComponent', () => {
  let component: ChoiceCurrencyComponent;
  let fixture: ComponentFixture<ChoiceCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoiceCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
