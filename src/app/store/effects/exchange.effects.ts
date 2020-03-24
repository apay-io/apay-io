import {Injectable} from '@angular/core';
import {AppState} from '../states/app.state';
import {select, Store} from '@ngrx/store';
import {StellarService} from '../../services/stellar/stellar.service';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';
import {currencies} from '../../../assets/currencies-list';
import {
  EExchangeActions,
  SetAmountIn,
  SetAmountInternal,
  SetAmountOut,
} from '../actions/exchange.actions';

@Injectable()
export class ExchangeEffects {
  private feeMultiplier = 0.995;

  constructor(
    private actions: Actions,
    private readonly store: Store<AppState>,
    private readonly stellarService: StellarService,
  ) {
  }

  @Effect()
  calculateAmountIn$ = this.actions.pipe(
    ofType<SetAmountOut>(EExchangeActions.SetAmountOut),
    switchMap(async (action) => {
      sessionStorage.setItem('amountOut', action.payload);
      sessionStorage.removeItem('amountIn');

      try {
        return await this.stellarService.calculateSell(
          currencies.find((item) => item.code === (localStorage.getItem('currencyIn') || 'XLM')),
          currencies.find((item) => item.code === (localStorage.getItem('currencyOut') || 'BTC')),
          action.payload,
        );
      } catch (err) {
        return {
          source_amount: null,
        };
      }
    }),
    switchMap((item) => {
      const amountOut = parseFloat(sessionStorage.getItem('amountOut'));
      const currencyOut = currencies.find((currency) => currency.code === (localStorage.getItem('currencyOut') || 'BTC'));

      return of(new SetAmountInternal({
        amountIn: (parseFloat(item.source_amount) / this.feeMultiplier).toFixed(7),
        amountOut: sessionStorage.getItem('amountOut'),
        amountFee: (amountOut * currencyOut.withdraw.fee_percent + currencyOut.withdraw.fee_fixed).toFixed(7),
      }));
    })
  );

  @Effect()
  calculateAmountOut$ = this.actions.pipe(
    ofType<SetAmountIn>(EExchangeActions.SetAmountIn),
    switchMap(async (action) => {
      sessionStorage.setItem('amountIn', action.payload);
      sessionStorage.removeItem('amountOut');

      try {
        return await this.stellarService.calculateBuy(
          currencies.find((item) => item.code === localStorage.getItem('currencyIn')),
          (parseFloat(action.payload) * this.feeMultiplier).toFixed(7).toString(),
          currencies.find((item) => item.code === localStorage.getItem('currencyOut')),
        );
      } catch (err) {
        return {
          source_amount: null,
        };
      }
    }),
    switchMap((item) => {
      const currencyOut = currencies.find((currency) => currency.code === localStorage.getItem('currencyOut'));
      const amountFee = parseFloat(item.destination_amount) * currencyOut.withdraw.fee_percent / 100 + currencyOut.withdraw.fee_fixed;

      return of(new SetAmountInternal({
        amountIn: sessionStorage.getItem('amountIn'),
        amountOut: item.destination_amount,
        amountFee: amountFee.toFixed(7),
      }));
    })
  );
}
