import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {WithdrawPageComponent} from "./withdraw-page.component";
import {expect} from "jasmine";

describe('WithdrawPageComponent', () => {
  let component: WithdrawPageComponent;
  let fixture: ComponentFixture<WithdrawPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
