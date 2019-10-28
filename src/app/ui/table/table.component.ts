import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {sparkline} from '@fnando/sparkline';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {currencies} from '../../../assets/currencies-list';
import {take} from 'rxjs/operators';

export interface UserData {
    icon: string;
    name: string;
    change: string;
    price: string;
    volume: string;
    depthUsd: string;
    priceUsd;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
    displayedColumns: string[] = ['icon', 'name', 'change', 'usd', 'volume', 'depth', 'graph', 'convert'];
    dataSource: MatTableDataSource<UserData>;

    @Input()
    stats$;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    currencies;
    initSparklineTimeOut;
    selected = 'USD';

    constructor(
        public currencySelectionService: CurrencySelectionService
    ) {
    }

    ngOnInit() {
      this.stats$.pipe(take(1)).subscribe((stats) => {
        this.currencies = currencies.map((v) => {
          const result = Object.assign(v, stats.find((item) => item.code === v.code));
          const prices = result.priceUsd.slice(0);
          result.price = prices.pop();
          result.volume = result.volume * result.price;
          result.change = prices.length > 0 ? (result.price - prices.pop()) / result.price * 100 : 0;
          return result;
        });

        this.dataSource = new MatTableDataSource(this.currencies);
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.connect().subscribe((data: any) => {
          clearTimeout(this.initSparklineTimeOut);
          if (window.innerWidth >= 1024 && data.length > 0) {
            this.initSparklineTimeOut = setTimeout(() => {
              data.forEach((item, id) => {
                const min = Math.min(...item.priceUsd);
                const adjustedPrices = item.priceUsd.map((price) => price - min);
                sparkline(document.getElementById(`sparkline-${item.code}`), adjustedPrices);
              });
            }, 200);
          }
        });
      });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    currencySelection(event, type: 'buy' | 'sell') {
        this.currencySelectionService.changeCurrency(event, type);
    }
}
