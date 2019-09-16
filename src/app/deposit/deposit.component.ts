import {Component, OnInit} from '@angular/core';
import {currencies} from "../../assets/currencies-list";
import {ModalService} from "../services/modal/modal.service";

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})

export class DepositComponent implements OnInit {
    currencies;
    selectedToken = {
        code: null,
        name: null,
        icon: null,
        tokenOperation: null
    };
    searchValue: string;
    arraySearchValue = [];

    constructor(
        public modalService: ModalService
    ) {
        this.currencies = currencies;
    }

    ngOnInit() {
        this.arraySearchValue = this.currencies;
    }

    selectToken(event) {
        this.selectedToken = {
            code: event.code,
            name: event.name,
            icon: event.icon,
            tokenOperation: event.tokenOperation
        }
    }

    search() {
        if (this.searchValue.length < 2) {
            this.arraySearchValue = this.currencies;
            return false;
        }

        this.searchValue = this.searchValue[0].toUpperCase() + this.searchValue.slice(1);
        this.arraySearchValue = this.currencies.filter(
            item => (item.name.indexOf(this.searchValue) > -1) ||  (item.code.indexOf(this.searchValue) > -1)
        );
    }
}
