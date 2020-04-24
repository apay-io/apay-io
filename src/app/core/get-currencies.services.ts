import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {take} from 'rxjs/operators';
import {currencies} from '../../assets/currencies-list';
import {Subject} from 'rxjs/index';
import {environment} from '../../environments/environment';

@Injectable()
export class GetCurrenciesServices {
  constructor(
    private readonly http: HttpClient,
  ) {
  }

  currenciesList;
  data = this.http.get(`${environment.api}/api/stats`);

  public state$ = new Subject<object>();


  get() {
    this.data.pipe(take(1)).subscribe((stats: Array<any>) => {
      this.currenciesList = currencies.map((v) => {
        const stat = stats.find(item => item.code === v.code);
        if (stat) {
          const result = Object.assign(v, stat);
          const prices = result.priceUsd.slice(0);
          result.price = prices.pop();
          result.volume = result.volume * result.price;
          result.change = prices.length > 0 ? (result.price - prices.pop()) / result.price * 100 : 0;
          return result;
        }
        return null;
      }).filter((v) => !!v);
      this.state$.next(this.currenciesList);
    });
  }
}

