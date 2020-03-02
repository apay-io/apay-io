import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {sparkline} from '@fnando/sparkline';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {GetCurrenciesServices} from '../../core/get-currencies.services';
import {HttpClient} from '@angular/common/http';

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

export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['icon', 'name', 'change', 'usd', 'volume', 'depth', 'graph', 'convert'];
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
        console.log(data);
        this.currencies = data;
        this.dataSource = new MatTableDataSource(this.currencies);
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
}
