import {Component, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {AppState} from '../../store/states/app.state';
import {ExchangeState} from '../../store/states/exchange.state';

@Component({
  selector: 'app-check-details',
  templateUrl: './check-details.component.html',
  styleUrls: ['./check-details.component.scss']
})
export class CheckDetailsComponent implements OnInit {
  verifyForm: FormGroup;

  private exchange: ExchangeState;
  private rate: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private readonly store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.verifyForm = this.fb.group({
      // 'agreement': ['', [(control) => {
      //   return !control.value ? {'required': true} : null;
      // }]]
    });
    this.store.pipe(select(selectExchange)).subscribe((exchange) => {
      this.exchange = exchange;
      if (exchange.amountOut && exchange.amountIn) {
        this.rate = parseFloat(exchange.amountOut) / parseFloat(exchange.amountIn);
      }
    });
  }

  async changeStep(event) {
    this.http.post('https://apay.io/api/swap', {
      currencyIn: this.exchange.currencyIn.code,
      currencyOut: this.exchange.currencyOut.code,
      addressOut: this.exchange.addressOut,
    }).subscribe((result: any) => {
      // this.orderParams.addressIn = result.address_in;
      // this.orderParams.memoIn = result.memo_in;
      // this.orderParams.memoInType = 'TEXT';
      // this.orderParams.id = result.memo_in;
      sessionStorage.setItem('addressIn', result.address_in);
      sessionStorage.setItem('id', result.memo_in);
      // this.currentStep.emit(event);
    });
  }
}
