import {Component, ElementRef, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/states/app.state';
import {ExchangeState} from '../../store/states/exchange.state';
import {SetExchangeStep} from '../../store/actions/exchange.actions';

@Component({
  selector: 'app-enter-amount',
  templateUrl: './enter-amount.component.html',
  styleUrls: ['./enter-amount.component.scss']
})
export class EnterAmountComponent implements OnInit {
  isProcessing;
  public exchange: ExchangeState;
  public rate: number;

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.isProcessing = true;
    this.store.pipe(select(selectExchange)).subscribe((exchange) => {
      this.exchange = exchange;
      if (exchange.amountOut && exchange.amountIn) {
        this.rate = parseFloat(exchange.amountOut) / parseFloat(exchange.amountIn);
      }
    });
  }

  get canContinue() {
    return this.exchange.amountIn && this.exchange.amountOut;
  }

  changeStep(step) {
    this.store.dispatch(new SetExchangeStep(step));
  }
}
