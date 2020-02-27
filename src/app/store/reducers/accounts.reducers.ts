import {initialAccountsState, AccountsState} from '../states/accounts.state';
import {EAccountsActions, AccountActions} from '../actions/accounts.actions';

export function accountsReducers(
  state = initialAccountsState,
  action: AccountActions,
): AccountsState {
  switch (action.type) {
    case EAccountsActions.GetAccountsSuccess: {
      state = {
        ...state,
        accounts: action.payload
      };
      localStorage.setItem('accounts', JSON.stringify(state.accounts));
      return state;
    }
    case EAccountsActions.GetAccountSuccess: {
      state = {
        ...state,
        currentAccount: action.payload
      };
      localStorage.setItem('currentAccount', JSON.stringify(state.currentAccount));
      return state;
    }
    default:
      return state;
  }
}
