import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {currencies} from '../../../assets/currencies-list';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {StellarService} from '../../services/stellar/stellar.service';
import {NotifyService} from "../../core/notify.service";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  tokens;
  currencyBuy;
  timerBuy;
  timerSell;
  stateButton = 'disabled';
  currencySell;
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
    public currencySelection: CurrencySelectionService,
    private readonly router: Router,
    private readonly stellarService: StellarService,
    private notify: NotifyService
  ) {
  }

  ngAfterViewInit() {
    if (sessionStorage.getItem('amountBuy')) {
      this.buyElement.nativeElement.value = sessionStorage.getItem('amountBuy');
      this.calculateSell();
    }
    if (sessionStorage.getItem('amountSell')) {
      this.sellElement.nativeElement.value = sessionStorage.getItem('amountSell');
      this.calculateBuy();
    }
  }

  ngOnInit() {
    this.currencyBuy = currencies
      .find(v => v.code === (sessionStorage.getItem('currencyBuy') || 'XDR'));
    this.currencySell = currencies
      .find(v => v.code === (sessionStorage.getItem('currencySell') || 'BTC'));

    if (this.isProcessingConverter) {
      this.amountFormConverter.controls['fromCurrency'].setValue(this.currencySell);
      this.amountFormConverter.controls['toCurrency'].setValue(this.currencyBuy);
    }

    this.tokens = currencies;
    this.arraySearchValue = this.tokensList = this.tokens;

    this.currencySelection.select
      .subscribe((currencyInfo) => {
        this.modalService.close('currencies');

        if (currencyInfo.typeCurrency === 'buy') {
          this.currencyBuy = currencyInfo.data;
          sessionStorage.setItem('currencyBuy', this.currencyBuy.code);
          this.buyElement.nativeElement.focus();
        } else {
          this.currencySell = currencyInfo.data;
          sessionStorage.setItem('currencySell', this.currencySell.code);
          this.sellElement.nativeElement.focus();
        }
        this.recalculateAmounts();
      });
  }

  async chooseCurrency(event, type) {
    if (type === 'sell') {
      this.currencySell = event;
      if (this.isProcessingConverter) {
        this.amountFormConverter.controls['fromCurrency'].setValue(this.currencySell);
      }
      sessionStorage.setItem('currencySell', this.currencySell.code);
    } else {
      this.currencyBuy = event;
      if (this.isProcessingConverter) {
        this.amountFormConverter.controls['toCurrency'].setValue(this.currencyBuy);
      }
      sessionStorage.setItem('currencyBuy', this.currencyBuy.code);
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
      code: this.currencySell.code
    };
  }

  openPopupBuy() {
    this.modalService.open('currencies');
    this.currencyInfoSave = {
      type: 'buy',
      code: this.currencyBuy.code
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
    [this.currencyBuy, this.currencySell] = [this.currencySell, this.currencyBuy];
    sessionStorage.setItem('currencySell', this.currencySell.code);
    sessionStorage.setItem('currencyBuy', this.currencyBuy.code);
    await this.recalculateAmounts();
  }

  continue() {
    if (this.stateButton === 'disabled') {
      return false
    }

    sessionStorage.setItem('currencySell', this.currencySell.code);
    sessionStorage.setItem('currencyBuy', this.currencyBuy.code);
    this.router.navigate(['/processing']);
  }

  async calculateSell() {
    sessionStorage.setItem('amountBuy', this.buyElement.nativeElement.value);
    sessionStorage.removeItem('amountSell');
    clearTimeout(this.timerSell)
    this.timerSell = setTimeout(async () => {
        await this.recalculateAmounts()
    }, 600)
  }

  async calculateBuy() {
    sessionStorage.setItem('amountSell', this.sellElement.nativeElement.value);
    sessionStorage.removeItem('amountBuy');
    clearTimeout(this.timerBuy)
    this.timerBuy = setTimeout(async () => {
        await this.recalculateAmounts()
    }, 600)
  }

  private async recalculateAmounts() {
    if (sessionStorage.getItem('amountSell')) {
      const result = await this.stellarService.calculateBuy(this.currencySell, this.sellElement.nativeElement.value, this.currencyBuy);
      this.buyElement.nativeElement.value = result.destination_amount;

      if (result === 'error') {
        this.stateButton = 'disabled';
        this.buyElement.nativeElement.value = '';
        this.notify.update('Incorrect value entered', 'error');
        return false
      }
      this.stateButton = 'active';
      this.notify.clear();

    } else if (sessionStorage.getItem('amountBuy')) {
      const result = await this.stellarService.calculateSell(this.currencySell, this.currencyBuy, this.buyElement.nativeElement.value);
      console.log(result);
      this.sellElement.nativeElement.value = result.source_amount;

      if (result === 'error') {
        this.stateButton = 'disabled';
        this.sellElement.nativeElement.value = '';
        this.notify.update('Incorrect value entered', 'error');
        return false
      }
      this.stateButton = 'active';
      this.notify.clear();
      // todo: check for minimum values deposit/withdrawal
      // todo: handle error when there is not enough liquidity to process the exchange
      // todo: sanity check, compare to market rate and if difference > 3% - tell the user
    }
  }
}
