import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {Router} from '@angular/router';
import {StellarService} from '../../services/stellar/stellar.service';
import {NotifyService} from '../../core/notify.service';
import {GetCurrenciesServices} from '../../core/get-currencies.services';
import {AppState} from '../../store/states/app.state';
import {select, Store} from '@ngrx/store';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {SetAmountIn, SetAmountOut, SetCurrencyIn, SetCurrencyOut} from '../../store/actions/exchange.actions';
import {ExchangeState} from '../../store/states/exchange.state';
import {ControlsCustomModalService} from '../../core/controls-custom-modal.service';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import { BigNumber } from 'bignumber.js';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'div[app-converter]',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {
  currencyIn;
  currencyOut;
  exchange: ExchangeState;
  stateButton = 'disabled';
  getCurrenciesSub;
  getInfoCurrencies;
  refreshClass = 'non-visible';
  timeoutRefresh;
  currencyInfoSave = {type: '', code: ''};
  @Input() isProcessingConverter = false;
  @Output() public outFlagLoader = new EventEmitter();

  @ViewChild('buy', {static: false}) buyElement: ElementRef;
  @ViewChild('sell', {static: false}) sellElement: ElementRef;


  constructor(
    public notify: NotifyService,
    public currencySelection: CurrencySelectionService,
    public controlsCustomModalService: ControlsCustomModalService,
    private readonly router: Router,
    private readonly stellarService: StellarService,
    private getCurrencies: GetCurrenciesServices,
    private readonly store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.getCurrencies.get();

    this.getCurrenciesSub = this.getCurrencies.state$.subscribe((data: any) => {
      if (data.length) {
        this.getInfoCurrencies = data;
      }
    });

    this.currencySelection.select
      .subscribe((currencyInfo) => {
        this.receiveCurrency({ selectedCurrency: currencyInfo.data, type: currencyInfo.typeCurrency});
      });

    this.store.pipe(select(selectExchange))
      .subscribe((exchange: ExchangeState) => {
        this.outFlagLoader.emit(false);
        if (!this.exchange && !exchange.amountOut && exchange.amountIn) {
          this.store.dispatch(new SetAmountIn({ amountIn: exchange.amountIn }));
        }
        if (!this.exchange && !exchange.amountIn && exchange.amountOut) {
          this.store.dispatch(new SetAmountOut({ amountOut: exchange.amountOut }));
        }

        this.exchange = exchange;
        this.currencyIn = exchange.currencyIn;
        this.currencyOut = exchange.currencyOut;
        if (exchange.amountIn && exchange.amountOut) {
          this.recalculateAmounts(exchange.amountIn, exchange.amountOut);
        }
      });
  }

  ngOnDestroy() {
    this.getCurrenciesSub.unsubscribe();
  }

  saveCurrentCurrency(currency) {
    this.controlsCustomModalService.open('choiceCurrency');
    this.currencyInfoSave = {
      type: currency.type,
      code: currency.code
    };
  }

  async revertCurrency() {
    const [oldIn, oldOut] = [this.exchange.currencyIn, this.exchange.currencyOut];
    if (sessionStorage.getItem('amountIn')) {
      this.store.dispatch(new SetAmountOut({
        currencyIn: oldOut.code,
        currencyOut: oldIn.code,
        amountOut: sessionStorage.getItem('amountIn'),
      }));
    } else if (sessionStorage.getItem('amountOut')) {
      this.store.dispatch(new SetAmountIn({
        currencyIn: oldOut.code,
        currencyOut: oldIn.code,
        amountIn: sessionStorage.getItem('amountOut'),
      }));
    }
  }

  continue() {
    if (this.stateButton !== 'active') {
      return false;
    }
    this.router.navigate(['/processing']);
  }

  async calculateSell(event) {
    this.outFlagLoader.emit(true);
    this.stateButton = 'loading';
    if (event.target.value > 0) {
      if (event.target.value < this.currencyOut.withdraw.min_amount) {
        this.notify.update('Minimum withdrawal ' + this.currencyOut.withdraw.min_amount + ' ' + this.currencyOut.code, 'error');
        return false;
      }
      this.store.dispatch(new SetAmountOut({ amountOut: event.target.value }));
    }
  }

  async calculateBuy(event) {
    this.outFlagLoader.emit(true);
    this.stateButton = 'loading';

    if (event.target.value > 0) {
      if (event.target.value < this.currencyIn.deposit.min_amount) {
        this.notify.update('Minimum deposit ' + this.currencyIn.deposit.min_amount + ' ' + this.currencyIn.code, 'error');
        return false;
      }
      this.store.dispatch(new SetAmountIn({ amountIn: event.target.value }));
    }
  }

  private async recalculateAmounts(amountIn, amountOut) {
    // this.refreshClass = 'non-visible';
    // clearTimeout(this.timeoutRefresh);
    // this.timeoutRefresh = setTimeout(() => {
    //   this.refreshClass = 'visible';
    // }, 1000);
    if (!amountIn || !amountOut) {
      // this.notify.update('Unable to find a path on the network. Please try again later or a different amount', 'error');
      this.stateButton = 'disabled';
      this.outFlagLoader.emit(false);
      return;
    }
    try {
      this.stateButton = 'active';
      this.notify.clear();

      if (new BigNumber(this.exchange.amountIn).lt(this.currencyIn.deposit.min_amount)) {
        this.notify.update('Minimum deposit ' + this.currencyIn.deposit.min_amount + ' ' + this.currencyIn.code, 'error');
        this.stateButton = 'disabled';
      }
      if (new BigNumber(this.exchange.amountOut).lt(this.currencyOut.withdraw.min_amount)) {
        this.notify.update('Minimum withdrawal ' + this.currencyOut.withdraw.min_amount + ' ' + this.currencyOut.code, 'error');
        this.stateButton = 'disabled';
      }
      if (this.getInfoCurrencies) {
        const inConvertToDollars = (this.getInfoCurrencies
          .find(item => item.code === this.exchange.currencyIn.code) || {})
          .price * parseFloat(this.exchange.amountIn);
        const outConvertToDollars = (this.getInfoCurrencies
          .find(item => item.code === this.exchange.currencyOut.code) || {})
          .price * parseFloat(this.exchange.amountOut);

        if (inConvertToDollars && outConvertToDollars && Math.abs(inConvertToDollars / outConvertToDollars) >= 1.08) {
          console.log(inConvertToDollars, outConvertToDollars);
          this.notify.update('Current exchange rate is not favourable due to the low liquidity on the DEX. Try again later or different amount', 'error');
          this.stateButton = 'disabled';
        }
      } else {
        // todo: retry when available
      }
    } catch (err) {
      console.log(err);
      this.stateButton = 'disabled';
      this.buyElement.nativeElement.value = '';
      this.notify.update('Unable to find a path on the network. Please try again later or a different amount', 'error');
    }
    this.outFlagLoader.emit(false);
  }

  async receiveCurrency(currency) {
    if (currency.type === 'sell') {
      this.store.dispatch(new SetCurrencyIn(currency.selectedCurrency));
      this.sellElement.nativeElement.focus();
    } else {
      this.store.dispatch(new SetCurrencyOut(currency.selectedCurrency));
      this.buyElement.nativeElement.focus();
    }

    await this.recalculateAmounts(this.exchange.amountIn, this.exchange.amountOut);
  }

  async refresh() {
    await this.recalculateAmounts(this.exchange.amountOut, this.exchange.amountIn);
  }
}

