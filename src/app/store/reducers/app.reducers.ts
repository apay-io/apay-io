import {AppState} from '../states/app.state';
import {ActionReducerMap} from '@ngrx/store';
import {accountsReducers} from './accounts.reducers';
import {exchangeReducers} from './exchange.reducers';

export const appReducers: ActionReducerMap<AppState, any> = {
  accounts: accountsReducers,
  exchange: exchangeReducers,
};
