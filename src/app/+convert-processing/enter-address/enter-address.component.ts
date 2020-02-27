import {Component, ElementRef, Input, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/states/app.state';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {ExchangeState} from '../../store/states/exchange.state';
import {SetAddressOut, SetExchangeStep} from '../../store/actions/exchange.actions';
import {StellarService} from '../../services/stellar/stellar.service';

@Component({
  selector: 'app-enter-address',
  templateUrl: './enter-address.component.html',
  styleUrls: ['./enter-address.component.scss']
})
export class EnterAddressComponent implements OnInit {
  private exchange: ExchangeState;
  private timer;

  addressOut;
  canContinue = false;

  constructor(
    private readonly store: Store<AppState>,
    private readonly stellar: StellarService,
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(selectExchange)).subscribe((exchange) => {
      this.exchange = exchange;
      this.validateAddress(exchange.addressOut);
    });
  }

  changeStep(step) {
    this.store.dispatch(new SetExchangeStep(step));
  }

  validateAddress(address: string, update = false) {
    this.canContinue = this.stellar.validateAddress(address);
    if (this.canContinue && update) {
      this.store.dispatch(new SetAddressOut(address));
    }
  }

  onKeyUp(event) {
    this.addressOut = event.target.value;
    if (this.exchange.addressOut !== this.addressOut) {
      this.canContinue = false;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.validateAddress(event.target.value, true);
    }, 600);
  }
}
