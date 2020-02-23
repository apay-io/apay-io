import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {sparkline} from '@fnando/sparkline';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {GetCurrenciesServices} from '../../core/get-currencies.services';

export interface UserData {
    icon: string;
    name: string;
    change: string;
    usd: string;
    volume: string;
    depth: string;
    graph;
}

@Component({
  selector: 'app-table-mobile',
  templateUrl: './table-mobile.component.html',
  styleUrls: ['./table-mobile.component.scss']
})

export class TableMobileComponent implements OnInit {
    displayedColumns: string[] = ['icon', 'name', 'change', 'usd'];
    dataSource: MatTableDataSource<UserData>;
    @Input() currencyInfo: object;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    currencies;
    searchValue;

    constructor(
        public currencySelectionService: CurrencySelectionService,
        private getCurrencies: GetCurrenciesServices,
    ) {}

    ngOnInit() {
        this.getCurrencies.state$.subscribe((data: any) => {
            if (data.length) {
                this.currencies = data
                this.dataSource = new MatTableDataSource(this.currencies);
                this.dataSource.sort = this.sort;
            }
        })
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    currencySelection(event, type: 'buy' | 'sell') {
        this.searchValue = '';
        this.applyFilter(this.searchValue);
        this.currencySelectionService.changeCurrency(event, type)
    }
}
