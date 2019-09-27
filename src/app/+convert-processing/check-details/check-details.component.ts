import {Component, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-check-details',
  templateUrl: './check-details.component.html',
  styleUrls: ['./check-details.component.scss']
})
export class CheckDetailsComponent implements OnInit {
    verifyForm: FormGroup;

    @Output() currentStep: EventEmitter<number> = new EventEmitter<number>();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
      this.verifyForm = this.fb.group({
          'agreement': ['', [(control) => {
              return !control.value ? { 'required': true } : null;
          }]]
      });
  }

  changeStep(event) {
      this.currentStep.emit(event);
  }
}
