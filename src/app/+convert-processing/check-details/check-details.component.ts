import {Component, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {AppState} from '../../store/states/app.state';
import {ExchangeState} from '../../store/states/exchange.state';
import {SetExchangeStep} from '../../store/actions/exchange.actions';

@Component({
  selector: 'app-check-details',
  templateUrl: './check-details.component.html',
  styleUrls: ['./check-details.component.scss']
})
export class CheckDetailsComponent implements OnInit {

  private exchange: ExchangeState;
  private rate: number;

  constructor(
    private http: HttpClient,
    private readonly store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(selectExchange)).subscribe((exchange) => {
      this.exchange = exchange;
      if (exchange.amountOut && exchange.amountIn) {
        this.rate = parseFloat(exchange.amountOut) / parseFloat(exchange.amountIn);
      }
    });
  }

  async changeStep(step) {
    this.http.post('https://apay.io/api/swap', {
      currencyIn: this.exchange.currencyIn.code,
      currencyOut: this.exchange.currencyOut.code,
      addressOut: this.exchange.addressOut,
    }).subscribe((result: any) => {
      this.exchange.addressIn = result.address_in;
      this.exchange.memoIn = result.memo_in;
      this.exchange.memoInType = 'TEXT';
      this.exchange.id = result.memo_in;
      sessionStorage.setItem('addressIn', result.address_in);
      sessionStorage.setItem('id', result.memo_in);
      this.store.dispatch(new SetExchangeStep(step));
    });
  }

  get canContinue() {
    return true;
  }
}
