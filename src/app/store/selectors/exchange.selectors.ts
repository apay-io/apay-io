import {AppState} from '../states/app.state';
import {createSelector} from '@ngrx/store';
import {ExchangeState} from '../states/exchange.state';

const exchangeState = (state: AppState) => state.exchange;

export const selectExchange = createSelector(
  exchangeState,
  (state: ExchangeState) => state
);
