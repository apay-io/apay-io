import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {ControlsCustomModalService} from '../../core/controls-custom-modal.service';
import {currencies} from '../../../assets/currencies-list';

@Component({
  selector: 'app-choice-currency-modal',
  templateUrl: './choice-currency-modal.component.html',
  styleUrls: ['./choice-currency-modal.component.scss']
})
export class ChoiceCurrencyModalComponent implements OnInit {
  modalInfo;
  arraySearchValue = [];
  private tokensList = [];
  searchValue: string;

  @Output() public outCurrency = new EventEmitter();
  @Input() currencyInfoSave = {};
  @Input() getInfoCurrencies = [];

  constructor(
    public modalService: ModalService,
    public controlsCustomModalService: ControlsCustomModalService
  ) {
    this.controlsCustomModalService.modal.subscribe(
      event => {
        this.modalInfo = event;
      }
    );
  }

  ngOnInit() {
    this.arraySearchValue = this.tokensList = currencies;
  }

  selectCurrency(event) {
    this.outCurrency.emit({selectedCurrency: event, type: this.currencyInfoSave['type']});
    this.clearSearch();
  }

  clearSearch() {
    this.searchValue = '';
    this.arraySearchValue = this.tokensList;
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
}
