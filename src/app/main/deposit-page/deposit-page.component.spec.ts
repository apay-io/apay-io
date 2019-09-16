import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DepositPageComponent} from "./deposit-page.component";
import {expect} from "jasmine";

describe('DepositPageComponent', () => {
  let component: DepositPageComponent;
  let fixture: ComponentFixture<DepositPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
