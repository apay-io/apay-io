import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {currencies} from '../../../assets/currencies-list';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {StellarService} from '../../services/stellar/stellar.service';
import {NotifyService} from '../../core/notify.service';
import {MatTableDataSource} from "@angular/material/table";
import {GetCurrenciesServices} from "../../core/get-currencies.services";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {
  isLoading;
  tokens;
  currencyOut;
  currencyIn;
  timerOut;
  timerIn;
  stateButton = 'disabled';
  getCurrenciesSub;
  getInfoCurrencies;
  searchValue: string;
  arraySearchValue = [];
  currencyInfoSave = {type: '', code: ''};
  private tokensList = [];
  @Output() popupChange: EventEmitter<string> = new EventEmitter();
  @Input() isProcessingConverter = false;
  @Input() amountFormConverter: FormGroup;

  @ViewChild('buy', {static: false}) buyElement: ElementRef;
  @ViewChild('sell', {static: false}) sellElement: ElementRef;


  constructor(
    public modalService: ModalService,
    public notify: NotifyService,
    public currencySelection: CurrencySelectionService,
    private readonly router: Router,
    private readonly stellarService: StellarService,
    private getCurrencies: GetCurrenciesServices) {
  }

  ngAfterViewInit() {
    if (sessionStorage.getItem('amountIn')) {
      this.recalculateAmounts();
    }
  }

  ngOnInit() {
    this.getCurrencies.get()

    this.getCurrenciesSub = this.getCurrencies.state$.subscribe((data: any) => {
      if (data.length) {
        this.getInfoCurrencies = data;
      }
    })
    this.currencyOut = currencies
      .find(v => v.code === (sessionStorage.getItem('currencyOut') || 'XLM'))
      || currencies.find(v => v.code === 'XLM');
    this.currencyIn = currencies
      .find(v => v.code === (sessionStorage.getItem('currencyIn') || 'BTC'))
      || currencies.find(v => v.code === 'BTC');

    if (this.isProcessingConverter) {
      this.amountFormConverter.controls['currencyIn'].setValue(this.currencyIn);
      this.amountFormConverter.controls['currencyOut'].setValue(this.currencyOut);
    }

    this.tokens = currencies;
    this.arraySearchValue = this.tokensList = this.tokens;

    this.currencySelection.select
      .subscribe((currencyInfo) => {
        this.modalService.close('currencies');

        if (currencyInfo.typeCurrency === 'buy') {
          this.currencyOut = currencyInfo.data;
          sessionStorage.setItem('currencyOut', this.currencyOut.code);
          this.buyElement.nativeElement.focus();
        } else {
          this.currencyIn = currencyInfo.data;
          sessionStorage.setItem('currencyIn', this.currencyIn.code);
          this.sellElement.nativeElement.focus();
        }
        this.recalculateAmounts();
      });
  }

  ngOnDestroy() {
    this.getCurrenciesSub.unsubscribe();
  }

  async chooseCurrency(event, type) {
    if (type === 'sell') {
      this.currencyIn = event;
      if (this.isProcessingConverter) {
        this.amountFormConverter.controls['currencyIn'].setValue(this.currencyIn);
      }
      sessionStorage.setItem('currencyIn', this.currencyIn.code);
    } else {
      this.currencyOut = event;
      if (this.isProcessingConverter) {
        this.amountFormConverter.controls['currencyOut'].setValue(this.currencyOut);
      }
      sessionStorage.setItem('currencyOut', this.currencyOut.code);
    }
    await this.recalculateAmounts();
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
    [this.currencyOut, this.currencyIn] = [this.currencyIn, this.currencyOut];
    sessionStorage.setItem('currencyIn', this.currencyIn.code);
    sessionStorage.setItem('currencyOut', this.currencyOut.code);
    await this.recalculateAmounts();
  }

  continue() {
    if (this.stateButton === 'disabled') {
      return false;
    }
    sessionStorage.setItem('currencyIn', this.currencyIn.code);
    sessionStorage.setItem('currencyOut', this.currencyOut.code);
    this.router.navigate(['/processing']);
  }

  async calculateSell() {
    this.stateButton = 'disabled';
    sessionStorage.setItem('amountOut', this.buyElement.nativeElement.value);
    sessionStorage.removeItem('amountIn');
    clearTimeout(this.timerOut);
    this.timerOut = setTimeout(async () => {
      await this.recalculateAmounts();
    }, 600);
  }

  async calculateBuy() {
    this.stateButton = 'disabled';
    sessionStorage.setItem('amountIn', this.sellElement.nativeElement.value);
    sessionStorage.removeItem('amountOut');
    clearTimeout(this.timerIn);
    this.isLoading = true;
    this.timerIn = setTimeout(async () => {
      console.log(this.sellElement.nativeElement.value);
      if (this.sellElement.nativeElement.value > 0) {
        if (this.sellElement.nativeElement.value < this.currencyIn.minDeposit) {
          this.buyElement.nativeElement.value = '';
          this.notify.update('Minimum value for ' + this.currencyIn.code + ' - ' + this.currencyIn.minDeposit, 'error');
          return false;
        }
        await this.recalculateAmounts();
      } else {
        this.isLoading = false;
      }
    }, 600);
  }

  private async recalculateAmounts() {
    try {
      if (sessionStorage.getItem('amountIn')) {
        const result = await this.stellarService.calculateBuy(this.currencyIn, sessionStorage.getItem('amountIn'), this.currencyOut);
        console.log(result);
        this.sellElement.nativeElement.value = sessionStorage.getItem('amountIn');
        this.buyElement.nativeElement.value = result.destination_amount;
        if (this.isProcessingConverter) {
          this.amountFormConverter.controls['amountIn'].setValue(sessionStorage.getItem('amountIn'));
          this.amountFormConverter.controls['amountOut'].setValue(result.destination_amount);
        }
      } else if (sessionStorage.getItem('amountOut')) {
        const result = await this.stellarService.calculateSell(this.currencyIn, this.currencyOut, sessionStorage.getItem('amountOut'));
        console.log(result);
        // todo: check for minimum values deposit/withdrawal
        this.sellElement.nativeElement.value = result.source_amount;
        this.buyElement.nativeElement.value = sessionStorage.getItem('amountOut');
        if (this.isProcessingConverter) {
          this.amountFormConverter.controls['amountIn'].setValue(result.source_amount);
          this.amountFormConverter.controls['amountOut'].setValue(sessionStorage.getItem('amountOut'));
        }
      }

      this.stateButton = 'active';
      this.notify.clear();

      const inConvertToDollars = this.getInfoCurrencies.find(item => item.code === this.currencyIn.code).price * this.sellElement.nativeElement.value;
      const outConvertToDollars = this.getInfoCurrencies.find(item => item.code === this.currencyOut.code).price * this.buyElement.nativeElement.value;
      const outDifferentPercent = outConvertToDollars / 100 * 5;

      if (Math.abs(inConvertToDollars - outConvertToDollars) >= outDifferentPercent) {
        this.notify.update('Current exchange rate is not favourable due to the low liquidity on the DEX. Try again later or smaller amount', 'error');
        this.stateButton = 'disabled';
      }
    } catch (err) {
      console.log(err);
      this.stateButton = 'disabled';
      this.buyElement.nativeElement.value = '';
      this.notify.update('Unable to find a path on the network. Please try again later or a different amount', 'error');
    }
    this.isLoading = false;
  }
}
