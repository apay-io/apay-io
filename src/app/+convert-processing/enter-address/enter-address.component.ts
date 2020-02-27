import {Component, ElementRef, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/states/app.state';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {ExchangeState} from '../../store/states/exchange.state';
import {SetExchangeStep} from '../../store/actions/exchange.actions';

@Component({
  selector: 'app-enter-address',
  templateUrl: './enter-address.component.html',
  styleUrls: ['./enter-address.component.scss']
})
export class EnterAddressComponent implements OnInit {
  addressForm: FormGroup;
  private exchange: ExchangeState;

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(selectExchange)).subscribe((exchange) => {
      this.exchange = exchange;
    });
    // todo: validate address
  }

  get canContinue() {
    return !!this.exchange.addressOut;
  }

  changeStep() {
    this.store.dispatch(new SetExchangeStep(3));
  }
}
