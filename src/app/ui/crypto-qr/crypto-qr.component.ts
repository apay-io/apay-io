import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-crypto-qr',
  templateUrl: './crypto-qr.component.html',
  styleUrls: ['./crypto-qr.component.scss']
})
export class CryptoQrComponent {

  @Input()
  code: string;

  @Input()
  address: string;

  constructor() { }

  getQR() {
    switch (this.code) {
      case 'BCH':
        return `bitcoincash:${this.address}`;
      case 'BTC':
        return `bitcoin:${this.address}`;
      case 'LTC':
        return `litecoin:${this.address}`;
      default:
        return this.address;
    }
  }
}
