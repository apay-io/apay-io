import {Component, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-check-details',
  templateUrl: './check-details.component.html',
  styleUrls: ['./check-details.component.scss']
})
export class CheckDetailsComponent implements OnInit {
  verifyForm: FormGroup;

  @Input()
  orderParams;
  @Output() currentStep: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
  }

  ngOnInit() {
    this.verifyForm = this.fb.group({
      // 'agreement': ['', [(control) => {
      //   return !control.value ? {'required': true} : null;
      // }]]
    });
  }

  async changeStep(event) {
    this.http.post('https://apay.io/api/swap', {
      currencyIn: this.orderParams.currencyIn.code,
      currencyOut: this.orderParams.currencyOut.code,
      addressOut: this.orderParams.addressOut,
    }).subscribe((result: any) => {
      this.orderParams.addressIn = result.address_in;
      this.orderParams.memoIn = result.memo_in;
      this.orderParams.memoInType = 'TEXT';
      this.orderParams.id = result.memo_in;
      sessionStorage.setItem('addressIn', result.address_in);
      sessionStorage.setItem('id', result.memo_in);
      this.currentStep.emit(event);
    });
  }
}
