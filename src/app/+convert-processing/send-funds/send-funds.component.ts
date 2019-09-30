import {Component, ElementRef, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-send-funds',
  templateUrl: './send-funds.component.html',
  styleUrls: ['./send-funds.component.scss']
})
export class SendFundsComponent implements OnInit {
    addressForm: FormGroup;

    @Output() currentStep: EventEmitter<number> = new EventEmitter<number>();

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
