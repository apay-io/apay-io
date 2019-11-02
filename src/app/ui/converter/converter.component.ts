import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {currencies} from '../../../assets/currencies-list';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {StellarService} from '../../services/stellar/stellar.service';
import {NotifyService} from '../../core/notify.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  tokens;
  currencyOut;
  currencyIn;
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
    private notify: NotifyService,
    public currencySelection: CurrencySelectionService,
    private readonly router: Router,
    private readonly stellarService: StellarService,
  ) {
  }

  ngAfterViewInit() {
    this.recalculateAmounts();
  }

  ngOnInit() {
    this.currencyOut = currencies
      .find(v => v.code === (sessionStorage.getItem('currencyOut') || 'XDR'));
    this.currencyIn = currencies
      .find(v => v.code === (sessionStorage.getItem('currencyIn') || 'BTC'));

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
    sessionStorage.setItem('currencyIn', this.currencyIn.code);
    sessionStorage.setItem('currencyOut', this.currencyOut.code);
    this.router.navigate(['/processing']);
  }

  async calculateSell() {
    sessionStorage.setItem('amountOut', this.buyElement.nativeElement.value);
    sessionStorage.removeItem('amountIn');
    await this.recalculateAmounts();
  }

  async calculateBuy() {
    sessionStorage.setItem('amountIn', this.sellElement.nativeElement.value);
    sessionStorage.removeItem('amountOut');
    await this.recalculateAmounts();
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
        // todo: sanity check, compare to market rate and if difference > 5% - tell the user
        this.sellElement.nativeElement.value = result.source_amount;
        this.buyElement.nativeElement.value = sessionStorage.getItem('amountOut');
        if (this.isProcessingConverter) {
          this.amountFormConverter.controls['amountIn'].setValue(result.source_amount);
          this.amountFormConverter.controls['amountOut'].setValue(sessionStorage.getItem('amountOut'));
        }
      }
    } catch (err) {
      console.log(err);
      this.notify.update('Unable to find a path on the network. Please try later or different amount', 'error');
    }
  }
}
