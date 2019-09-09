import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalService} from "../services/modal/modal.service";
import {CurrencySelectionService} from "../core/currency-selection.service";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  tokens;
  currencyBuy;
  currencySell;
    @ViewChild('buy', {static: false}) buyElement: ElementRef;
    @ViewChild('sell', {static: false}) sellElement: ElementRef;


    constructor(public modalService: ModalService, public currencySelection: CurrencySelectionService) { }

  ngOnInit() {
    this.currencyBuy = {
        code: 'XDR',
        name: 'Pays XDR',
        icon: 'https://xdr.com/images/common/xdr-coin.svg'
    };
    this.currencySell = {
        code: 'BTC',
        name: 'Bitcoin',
        icon: 'https://apay.io/public/logo/btc.svg'
    };
    this.tokens = [
          {
              code: 'XDR',
              name: 'Pays XDR',
              icon: 'https://xdr.com/images/common/xdr-coin.svg'
          },
          {
              code: 'BTC',
              name: 'Bitcoin',
              icon: 'https://apay.io/public/logo/btc.svg'
          },
          {
              code: 'BCH',
              name: 'Bitcoin Cash',
              icon: 'https://apay.io/public/logo/bch.svg'
          },
          {
              code: 'ETH',
              name: 'Ethereum',
              icon: 'https://apay.io/public/logo/eth.png'
          },
          {
              code: 'LTC',
              name: 'Litecoin',
              icon: 'https://apay.io/public/logo/ltc.png'
          },
          {
              code: 'BAT',
              name: 'Basic Attention Token',
              icon: 'https://apay.io/public/logo/bat.svg'
          },
          {
              code: 'KIN',
              name: 'Kin',
              icon: 'https://apay.io/public/logo/kin.svg'
          },
          {
              code: 'LINK',
              name: 'ChainLink',
              icon: 'https://apay.io/public/logo/link.svg'
          },
          {
              code: 'MTL',
              name: 'Metal',
              icon: 'https://apay.io/public/logo/mtl.svg'
          },
          {
              code: 'OMG',
              name: 'OmiseGo',
              icon: 'https://apay.io/public/logo/omg.svg'
          },
          {
              code: 'REP',
              name: 'Augur',
              icon: 'https://apay.io/public/logo/rep.png'
          },
          {
              code: 'SALT',
              name: 'SALT',
              icon: 'https://apay.io/public/logo/salt.svg'
          },
          {
              code: 'ZRX',
              name: '0xProject',
              icon: 'https://apay.io/public/logo/zrx.svg'
          },
      ];

      this.currencySelection.select
          .subscribe((currencyInfo) => {
              if (currencyInfo.typeCurrency === 'buy') {
                  this.currencyBuy = currencyInfo.data;
                  this.buyElement.nativeElement.focus();
              } else {
                  this.currencySell = currencyInfo.data;
                  this.sellElement.nativeElement.focus();
              }
          });
      }

  chooseCurrencySell (event) {
    this.currencySell = event;
  }

  chooseCurrencyBuy (event) {
    this.currencyBuy = event;
  }

}
