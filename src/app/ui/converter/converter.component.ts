import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {currencies} from '../../../assets/currencies-list';
import {Router} from '@angular/router';
import {StellarService} from '../../services/stellar/stellar.service';
import {NotifyService} from '../../core/notify.service';
import {GetCurrenciesServices} from '../../core/get-currencies.services';
import {AppState} from '../../store/states/app.state';
import {select, Store} from '@ngrx/store';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {SetAmountIn, SetAmountOut, SetCurrencyIn, SetCurrencyOut} from '../../store/actions/exchange.actions';
import {ExchangeState} from '../../store/states/exchange.state';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy, AfterViewInit {
  currencyIn;
  currencyOut;
  exchange: ExchangeState;
  timer;
  stateButton = 'disabled';
  getCurrenciesSub;
  getInfoCurrencies;
  searchValue: string;
  arraySearchValue = [];
  currencyInfoSave = {type: '', code: ''};
  private tokensList = [];
  @Output() popupChange: EventEmitter<string> = new EventEmitter();
  @Input() isProcessingConverter = false;

  @ViewChild('buy', {static: false}) buyElement: ElementRef;
  @ViewChild('sell', {static: false}) sellElement: ElementRef;


  constructor(
    public modalService: ModalService,
    public notify: NotifyService,
    public currencySelection: CurrencySelectionService,
    private readonly router: Router,
    private readonly stellarService: StellarService,
    private getCurrencies: GetCurrenciesServices,
    private readonly store: Store<AppState>,
  ) {
  }

  ngAfterViewInit() {


  }

  ngOnInit() {
    this.getCurrencies.get();

    this.getCurrenciesSub = this.getCurrencies.state$.subscribe((data: any) => {
      if (data.length) {
        this.getInfoCurrencies = data;
      }
    });

    this.arraySearchValue = this.tokensList = currencies;

    this.currencySelection.select
      .subscribe((currencyInfo) => {
        this.modalService.close('currencies');
        this.chooseCurrency(currencyInfo.data, currencyInfo.typeCurrency);
      });

    this.store.pipe(select(selectExchange))
      .subscribe((exchange: ExchangeState) => {
        if (!this.exchange && !exchange.amountOut) {
          this.store.dispatch(new SetAmountIn(exchange.amountIn));
        }
        if (!this.exchange && !exchange.amountIn) {
          this.store.dispatch(new SetAmountOut(exchange.amountOut));
        }

        console.log(exchange);
        this.exchange = exchange;
        this.currencyIn = exchange.currencyIn;
        this.currencyOut = exchange.currencyOut;
        this.recalculateAmounts(exchange.amountIn, exchange.amountOut);
      });
  }

  ngOnDestroy() {
    this.getCurrenciesSub.unsubscribe();
  }

  async chooseCurrency(event, type) {
    if (type === 'sell') {
      this.store.dispatch(new SetCurrencyIn(event));
      this.sellElement.nativeElement.focus();
    } else {
      this.store.dispatch(new SetCurrencyOut(event));
      this.buyElement.nativeElement.focus();
    }
    await this.recalculateAmounts(this.exchange.amountIn, this.exchange.amountOut);
    this.clearSearch();
  }

  clearSearch() {
    this.searchValue = '';
    this.arraySearchValue = this.tokensList;
  }

  openPopupSell() {
    this.modalService.open('currencies');
    this.currencyInfoSave = {
      type: 'sell',
      code: this.currencyIn.code
    };
  }

  openPopupBuy() {
    this.modalService.open('currencies');
    this.currencyInfoSave = {
      type: 'buy',
      code: this.currencyOut.code
    };
  }

  search() {
    if (this.searchValue.length < 2) {
      this.arraySearchValue = this.tokensList;
      return false;
    }

    this.searchValue = this.searchValue[0].toUpperCase() + this.searchValue.slice(1);
    this.arraySearchValue = this.tokensList.filter(
      item => (item.name.indexOf(this.searchValue) > -1) || (item.code.indexOf(this.searchValue.toUpperCase()) > -1)
    );
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
      if (event.target.value < this.currencyOut.minWithdraw) {
        this.notify.update('Minimum value for ' + this.currencyOut.code + ' - ' + this.currencyOut.minWithdraw, 'error');
        return false;
      }
      this.store.dispatch(new SetAmountOut(event.target.value));
    }
  }

  async calculateBuy(event) {
    console.log(event.target.value);
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
          .find(item => item.code === this.exchange.currencyOut.code).price *
          (parseFloat(this.exchange.amountOut) + parseFloat(this.exchange.amountFee));
        const outDifferentPercent = outConvertToDollars / 100 * 5;

        if (Math.abs(inConvertToDollars - outConvertToDollars) >= outDifferentPercent) {
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
}
