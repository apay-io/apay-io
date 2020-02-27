import { Account } from '../../core/account.interface';

export interface AccountsState {
  accounts: Account[];
  currentAccount: Account;
}

export const initialAccountsState: AccountsState = {
  accounts: JSON.parse(localStorage.getItem('accounts')) || {},
  currentAccount: JSON.parse(localStorage.getItem('currentAccount')) || {},
};
