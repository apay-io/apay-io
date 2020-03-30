import {Component, OnInit, Output} from '@angular/core';
import {AppState} from '../../store/states/app.state';
import {select, Store} from '@ngrx/store';
import {ExchangeState} from '../../store/states/exchange.state';
import {selectExchange} from '../../store/selectors/exchange.selectors';

@Component({
  selector: 'app-wait-exchange-tmp',
  templateUrl: './wait-exchange-tmp.component.html',
  styleUrls: ['./wait-exchange-tmp.component.scss']
})
export class WaitExchangeTmpComponent implements OnInit {
  showDetails = false;
  stepWaiting = 1;

  public exchange: ExchangeState;

  constructor(
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(selectExchange))
      .subscribe((exchange) => {
        this.exchange = exchange;
      });
  }
}
