import {AppState} from '../states/app.state';
import {createSelector} from '@ngrx/store';
import {AccountsState} from '../states/accounts.state';

const accountsState = (state: AppState) => state.accounts;

export const selectAccounts = createSelector(
  accountsState,
  (state: AccountsState) => state.accounts
);

export const selectCurrentAccount = createSelector(
  accountsState,
  (state: AccountsState) => state.currentAccount
);
