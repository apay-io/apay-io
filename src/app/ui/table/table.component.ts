import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {sparkline} from '@fnando/sparkline';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {GetCurrenciesServices} from '../../core/get-currencies.services';
import {HttpClient} from '@angular/common/http';

export interface UserData {
  icon: string;
  code: string;
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

export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['icon', 'code', 'change', 'price', 'volume', 'depthUsd', 'graph', 'convert'];
  dataSource: MatTableDataSource<UserData>;

  @Input()
  stats$;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  currencies;
  getCurrenciesSub;
  initSparklineTimeOut;
  rates;
  selectedCurrency = 'USD';
  selectedCurrencyRate: number;

  constructor(private readonly http: HttpClient,
              public currencySelectionService: CurrencySelectionService,
              private getCurrencies: GetCurrenciesServices,
  ) {
  }

  ngOnInit() {
    this.http.get(`https://rates.apay.io`).subscribe((data) => {
      this.rates = data;
      this.selectUnit();
    });
    this.getCurrenciesSub = this.getCurrencies.state$.subscribe((data: any) => {
      if (data.length) {
        this.currencies = data;
        this.dataSource = new MatTableDataSource(this.currencies);
        this.dataSource.sort = this.sort;
        this.dataSource.connect().subscribe((row: any) => {
          clearTimeout(this.initSparklineTimeOut);
          if (window.innerWidth >= 800 && row.length > 0) {
            this.initSparklineTimeOut = setTimeout(() => {
              row.forEach((item, id) => {
                if (item.code === 'USDT') {
                  return;
                }
                const min = Math.min(...item.priceUsd);
                const adjustedPrices = item.priceUsd.map((price) => price - min);
                sparkline(document.getElementById(`sparkline-${item.code}`), adjustedPrices);
              });
            }, 500);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.getCurrenciesSub) {
      this.getCurrenciesSub.unsubscribe();
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  currencySelection(event, type: 'buy' | 'sell') {
    this.currencySelectionService.changeCurrency(event, type);
  }

  selectUnit() {
    this.selectedCurrencyRate = this.rates[this.selectedCurrency] / this.rates['USD'];
  }

  formatAmount(amount: number, type = 'precision') {
    const symbol = this.selectedCurrency === 'USD' ? '$' : (this.selectedCurrency === 'EUR' ? '€' : '');
    if (type === 'precision') {
      return symbol + (amount * this.selectedCurrencyRate).toPrecision(4).replace(/\.0+$/, '');
    } else {
      return symbol + (Math.round(amount * this.selectedCurrencyRate)).toLocaleString();
    }
  }
}
