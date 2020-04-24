import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/states/app.state';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {ExchangeState} from '../../store/states/exchange.state';
import {SetAddressOut, SetExchangeStep} from '../../store/actions/exchange.actions';
import {StellarService} from '../../services/stellar/stellar.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-enter-address',
  templateUrl: './enter-address.component.html',
  styleUrls: ['./enter-address.component.scss']
})
export class EnterAddressComponent implements OnInit {
  public exchange: ExchangeState;
  private timer;
  public loading;

  addressOut;
  isAddressValid = false;

  @ViewChild('address', {static: false}) addressElement: ElementRef;
  errorMessage = '';

  constructor(
    private readonly store: Store<AppState>,
    private readonly stellar: StellarService,
    private readonly http: HttpClient,
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(selectExchange)).subscribe((exchange) => {
      this.exchange = exchange;
      if (exchange.step === 2) {
        setTimeout(() => {
          this.addressElement.nativeElement.focus();
        }, 200);
        this.validateAddress(exchange.addressOut);
      }
    });
  }

  changeStep(step) {
    if (this.isAddressValid) {
      this.store.dispatch(new SetExchangeStep(step));
    }
    if (step === 1) {
      this.store.dispatch(new SetExchangeStep(step));
    }
  }

  async validateAddress(address: string, update = false) {
    this.loading = true;
    this.errorMessage = '';
    // todo: validate stellar federated addresses
    const validStellarAddress = this.stellar.validateAddress(address);
    if (!this.exchange.currencyOut.stellarNative) {
      const hasTrustline = validStellarAddress ? await this.stellar.hasTrustline(address, this.exchange.currencyOut) : false;
      if (validStellarAddress && !hasTrustline) {
        this.isAddressValid = false;
        this.errorMessage = `You need to add trustline for ${this.exchange.currencyOut.code} first`;
        return;
      }
      this.isAddressValid = validStellarAddress && hasTrustline ||
        (await this.http.post('https://test.apay.io/validateAddress', {
          asset_code: this.exchange.currencyOut.code,
          dest: address,
        }).toPromise()) as any;
    } else {
      this.isAddressValid = validStellarAddress;
    }

    if (this.isAddressValid) {
      if (update) {
        this.store.dispatch(new SetAddressOut(address));
      }
    } else {
      this.errorMessage = 'Invalid address';
    }
    this.loading = false;
  }

  onKeyUp(event) {
    this.errorMessage = '';
    this.addressOut = event.target.value;
    if (this.exchange.addressOut !== this.addressOut) {
      this.isAddressValid = false;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.validateAddress(event.target.value, true);
    }, 600);
  }
}
