import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-choice-currency',
  templateUrl: './choice-currency.component.html',
  styleUrls: ['./choice-currency.component.scss']
})
export class ChoiceCurrencyComponent {
  @Output() public outCurrentCurrency = new EventEmitter();
  @Input() exchange;

  constructor() {
  }

  openPopup(currencyInfo) {
    this.outCurrentCurrency.emit({code: currencyInfo.value.code, type: currencyInfo.type});
  }
}
