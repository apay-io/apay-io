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

@Component({
  selector: 'app-converter',
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
        if (!this.exchange && !exchange.amountOut && exchange.amountIn) {
          this.store.dispatch(new SetAmountIn(exchange.amountIn));
        }
        if (!this.exchange && !exchange.amountIn && exchange.amountOut) {
          this.store.dispatch(new SetAmountOut(exchange.amountOut));
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
    this.store.dispatch(new SetCurrencyIn(oldOut));
    this.store.dispatch(new SetCurrencyOut(oldIn));
    if (sessionStorage.getItem('amountIn')) {
      this.store.dispatch(new SetAmountOut(sessionStorage.getItem('amountIn')));
    } else if (sessionStorage.getItem('amountOut')) {
      this.store.dispatch(new SetAmountIn(sessionStorage.getItem('amountOut')));
    }
    await this.recalculateAmounts(this.exchange.amountOut, this.exchange.amountIn);
  }

  continue() {
    if (this.stateButton !== 'active') {
      return false;
    }
    this.router.navigate(['/processing']);
  }

  async calculateSell(event) {
    this.stateButton = 'loading';
    if (event.target.value > 0) {
      if (event.target.value < this.currencyOut.withdraw.min_amount) {
        this.notify.update('Minimum value for ' + this.currencyOut.code + ' - ' + this.currencyOut.withdraw.min_amount, 'error');
        return false;
      }
      this.store.dispatch(new SetAmountOut(event.target.value));
    }
  }

  async calculateBuy(event) {
    this.stateButton = 'loading';
    if (event.target.value > 0) {
      if (event.target.value < this.currencyIn.minDeposit) {
        this.notify.update('Minimum value for ' + this.currencyIn.code + ' - ' + this.currencyIn.minDeposit, 'error');
        return false;
      }
      this.store.dispatch(new SetAmountIn(event.target.value));
    }
  }

  private async recalculateAmounts(amountIn, amountOut) {
    this.refreshClass = 'non-visible';
    clearTimeout(this.timeoutRefresh);
    this.timeoutRefresh = setTimeout(() => {
      this.refreshClass = 'visible';
    }, 10000);
    if (!amountIn || !amountOut) {
      this.notify.update('Unable to find a path on the network. Please try again later or a different amount', 'error');
      this.stateButton = 'disabled';
      return;
    }
    try {
      this.stateButton = 'active';
      this.notify.clear();

      if (this.getInfoCurrencies) {
        const inConvertToDollars = this.getInfoCurrencies
          .find(item => item.code === this.exchange.currencyIn.code).price * parseFloat(this.exchange.amountIn);
        const outConvertToDollars = this.getInfoCurrencies
          .find(item => item.code === this.exchange.currencyOut.code).price * parseFloat(this.exchange.amountOut);

        if (Math.abs(inConvertToDollars / outConvertToDollars) >= 1.05) {
          this.notify.update('Current exchange rate is not favourable due to the low liquidity on the DEX. Try again later or smaller amount', 'error');
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

