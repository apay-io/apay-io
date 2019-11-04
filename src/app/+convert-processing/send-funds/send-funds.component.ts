import {Component, ElementRef, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-send-funds',
  templateUrl: './send-funds.component.html',
  styleUrls: ['./send-funds.component.scss']
})
export class SendFundsComponent implements OnInit {
  addressForm: FormGroup;

  @Input()
  orderParams;
  @Output() currentStep: EventEmitter<number> = new EventEmitter<number>();

  @ViewChildren('canvas')
  canvas;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.addressForm = this.fb.group({
      'address': ['', [
        Validators.required
      ]],
    });
  }

  changeStep(event) {
    this.currentStep.emit(event);
  }
}
