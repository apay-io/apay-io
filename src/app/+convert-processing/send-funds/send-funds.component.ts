import {Component, ElementRef, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import * as QRCode from 'qrcode';
import {SetExchangeStep} from '../../store/actions/exchange.actions';
import {AppState} from '../../store/states/app.state';
import {select, Store} from '@ngrx/store';
import {ExchangeState} from '../../store/states/exchange.state';
import {selectExchange} from '../../store/selectors/exchange.selectors';

@Component({
  selector: 'app-send-funds',
  templateUrl: './send-funds.component.html',
  styleUrls: ['./send-funds.component.scss']
})
export class SendFundsComponent implements OnInit {
  addressForm: FormGroup;
  public exchange: ExchangeState;

  @ViewChildren('canvas')
  canvas;

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.addressForm = this.fb.group({
      'address': ['', [
        Validators.required
      ]],
    });
    this.store.pipe(select(selectExchange))
      .subscribe((exchange) => {
        this.exchange = exchange;
      });
  }

  changeStep(step) {
    this.store.dispatch(new SetExchangeStep(step));
  }
}
