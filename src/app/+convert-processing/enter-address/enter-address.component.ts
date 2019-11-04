import {Component, ElementRef, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventEmitter} from '@angular/core';

@Component({
  selector: 'app-enter-address',
  templateUrl: './enter-address.component.html',
  styleUrls: ['./enter-address.component.scss']
})
export class EnterAddressComponent implements OnInit {
  addressForm: FormGroup;

  @Input()
  orderParams;
  @Output() currentStep: EventEmitter<number> = new EventEmitter<number>();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.addressForm = this.fb.group({
      'address': ['', [
        Validators.required
      ]],
    });
    this.addressForm.valueChanges.subscribe((form) => {
      this.orderParams.addressOut = form.address;
    });
    //todo: validate address
  }

  changeStep(event) {
    this.currentStep.emit(event);
  }
}
