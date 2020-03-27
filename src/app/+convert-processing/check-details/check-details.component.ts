import {Component, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import {selectExchange} from '../../store/selectors/exchange.selectors';
import {AppState} from '../../store/states/app.state';
import {ExchangeState} from '../../store/states/exchange.state';
import {SetExchangeStep, SetSwapParams} from '../../store/actions/exchange.actions';
import {environment} from '../../../environments/environment';
import {SocketService} from '../../services/socket/socket';

@Component({
  selector: 'app-check-details',
  templateUrl: './check-details.component.html',
  styleUrls: ['./check-details.component.scss']
})
export class CheckDetailsComponent implements OnInit {

  public exchange: ExchangeState;
  public rate: number;

  constructor(
    private http: HttpClient,
    private readonly store: Store<AppState>,
    private readonly socketService: SocketService,
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(selectExchange)).subscribe((exchange) => {
      this.exchange = exchange;
      if (exchange.amountOut && exchange.amountIn) {
        this.rate = parseFloat(exchange.amountOut) / parseFloat(exchange.amountIn);
      }
    });
  }

  async changeStep(step) {
    this.store.dispatch(new SetExchangeStep(step));
  }

  async process() {
    this.http.post(environment.backend + '/swap', {
      currencyIn: this.exchange.currencyIn.code,
      currencyOut: this.exchange.currencyOut.code,
      addressOut: this.exchange.addressOut,
    }).subscribe((result: any) => {
      result.id = result.id.substr(0, 8);
      this.exchange.addressIn = result.addressIn;
      this.socketService.connect(result.addressIn);
      this.exchange.memoIn = result.addressInExtra;
      this.exchange.memoInType = 'ID';
      this.exchange.id = result.id;
      this.store.dispatch(new SetSwapParams(result));
    }, (err) => {
      console.log(err);
    });
  }

  get canContinue() {
    return true;
  }
}
