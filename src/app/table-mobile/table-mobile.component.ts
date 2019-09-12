import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {sparkline} from '@fnando/sparkline';
import {CurrencySelectionService} from "../core/currency-selection.service";
import {currencies} from '../../assets/currencies-list';

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
        public currencySelectionService: CurrencySelectionService
    ) {
        this.currencies = currencies;
        this.dataSource = new MatTableDataSource(this.currencies);
    }

    ngOnInit() {
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
