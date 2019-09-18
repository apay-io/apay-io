import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeInfoComponent } from './exchange-info.component';

describe('ExchangeInfoComponent', () => {
  let component: ExchangeInfoComponent;
  let fixture: ComponentFixture<ExchangeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
