import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {sparkline} from '@fnando/sparkline';
import {CurrencySelectionService} from "../../core/currency-selection.service";
import {currencies} from "../../../assets/currencies-list";

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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
    displayedColumns: string[] = ['icon', 'name', 'change', 'usd', 'volume', 'depth', 'graph', 'convert'];
    dataSource: MatTableDataSource<UserData>;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    currencies;
    initSparklineTimeOut;
    selected = 'USD';

    constructor(
        public currencySelectionService: CurrencySelectionService
    ) {
        this.currencies = currencies;
        this.dataSource = new MatTableDataSource(this.currencies);
    }

    ngOnInit() {
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.connect().subscribe(data => {
            clearTimeout(this.initSparklineTimeOut);
            if (window.innerWidth >= 1024 && data.length > 0) {
                this.initSparklineTimeOut = setTimeout(() => {
                    data.forEach((item, id) => {
                        sparkline(document.getElementsByClassName('sparkline')[id], item.graph);
                    });
                }, 2000);
            }
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    currencySelection(event, type: 'buy' | 'sell') {
        this.currencySelectionService.changeCurrency(event, type)
    }
}
