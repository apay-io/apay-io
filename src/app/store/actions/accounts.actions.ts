import { Action } from '@ngrx/store';
import {Account} from '../../core/account.interface';

export enum EAccountsActions {
  GetAccounts = '[Account] Get Accounts',
  GetAccountsSuccess = '[Account] Get Accounts success',
  GetAccount = '[Account] Get Account',
  GetAccountSuccess = '[Account] Get Account success',
}

export class GetAccounts implements Action {
  public readonly type = EAccountsActions.GetAccounts;
}

export class GetAccountsSuccess implements Action {
  public readonly type = EAccountsActions.GetAccountsSuccess;

  constructor(public payload: Account[]) {}
}

export class GetAccount implements Action {
  public readonly type = EAccountsActions.GetAccount;
}

export class GetAccountSuccess implements Action {
  public readonly type = EAccountsActions.GetAccountSuccess;

  constructor(public payload: Account) {}
}

export type AccountActions = GetAccounts | GetAccountsSuccess | GetAccount | GetAccountSuccess;
