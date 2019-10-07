import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";
import {CurrencySelectionService} from "../../core/currency-selection.service";
import {currencies} from "../../../assets/currencies-list";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  tokens;
  currencyBuy;
  currencySell;
  searchValue: string;
  arraySearchValue = [];
  currencyInfoSave = {type: null, code: null};
  private tokensList = [];
    @Output() popupChange: EventEmitter<string> = new EventEmitter();
    @Input() isProcessingConverter: boolean = false;
    @Input() amountFormConverter: FormGroup;

    @ViewChild('buy', {static: false}) buyElement: ElementRef;
    @ViewChild('sell', {static: false}) sellElement: ElementRef;


    constructor(public modalService: ModalService, public currencySelection: CurrencySelectionService) { }

  ngOnInit() {
    this.currencyBuy = {
        code: 'XDR',
        name: 'Pays XDR',
        icon: '/assets/img/xdr-coin.svg'
    };
    this.currencySell = {
        code: 'BTC',
        name: 'Bitcoin',
        icon: 'https://apay.io/public/logo/btc.svg'
    };

    if (this.isProcessingConverter) {
        this.amountFormConverter.controls['fromCurrency'].setValue(this.currencySell)
        this.amountFormConverter.controls['toCurrency'].setValue(this.currencyBuy)
    }

    this.tokens = currencies;
    this.arraySearchValue = this.tokensList = this.tokens;

      this.currencySelection.select
          .subscribe((currencyInfo) => {
              this.modalService.close('currencies');

              if (currencyInfo.typeCurrency === 'buy') {
                  this.currencyBuy = currencyInfo.data;
                  this.buyElement.nativeElement.focus();
              } else {
                  this.currencySell = currencyInfo.data;
                  this.sellElement.nativeElement.focus();
              }
          });
      }

  chooseCurrency(event, type) {
    if (type === 'sell') {
        this.currencySell = event;
        if (this.isProcessingConverter) {
            this.amountFormConverter.controls['fromCurrency'].setValue(this.currencySell)
        }
    } else {
        this.currencyBuy = event;
        if (this.isProcessingConverter) {
            this.amountFormConverter.controls['toCurrency'].setValue(this.currencyBuy)
        }
    }
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
      }
  }

  openPopupBuy() {
      this.modalService.open('currencies');
      this.currencyInfoSave = {
          type: 'buy',
          code: this.currencyBuy.code
      }
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

  revertCurrency() {
      [this.currencyBuy, this.currencySell] = [this.currencySell, this.currencyBuy];
  }
}
