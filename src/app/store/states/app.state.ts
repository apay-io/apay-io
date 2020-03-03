import {AccountsState, initialAccountsState } from './accounts.state';
import {ExchangeState, initialExchangeState} from './exchange.state';


export interface AppState {
  accounts: AccountsState;
  exchange: ExchangeState;
}

export const initialAppState: AppState = {
  accounts: initialAccountsState,
  exchange: initialExchangeState,
};

export function getInitialState(): AppState {
  return initialAppState;
}
