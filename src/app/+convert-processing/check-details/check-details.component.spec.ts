import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterPaysComponent } from './check-details.component';

describe('EnterPaysComponent', () => {
  let component: EnterPaysComponent;
  let fixture: ComponentFixture<EnterPaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterPaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterPaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  //
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
