import { Action } from '@ngrx/store';
import {Currency} from '../../core/currency.interface';

export enum EExchangeActions {
  SetAmountIn = '[Exchange] Set amountIn',
  SetAmountInternal = '[Exchange] Set amountInInternal',
  SetAmountOut = '[Exchange] Set amountOut',
  SetCurrencyIn = '[Exchange] Set currencyIn',
  SetCurrencyOut = '[Exchange] Set currencyOut',
  SetExchangeStep = '[Exchange] Set step',
  SetAddressOut = '[Exchange] Set addressOut',
  SetSwapParams = '[Exchange] Set swap params',
}

export class SetAmountIn implements Action {
  public readonly type = EExchangeActions.SetAmountIn;

  constructor(public payload: string) {}
}

export class SetAmountInternal implements Action {
  public readonly type = EExchangeActions.SetAmountInternal;

  constructor(public payload: { amountIn: string, amountOut: string, amountFee: string; }) {}
}

export class SetAmountOut implements Action {
  public readonly type = EExchangeActions.SetAmountOut;

  constructor(public payload: string) {}
}

export class SetCurrencyIn implements Action {
  public readonly type = EExchangeActions.SetCurrencyIn;

  constructor(public payload: Currency) {}
}

export class SetCurrencyOut implements Action {
  public readonly type = EExchangeActions.SetCurrencyOut;

  constructor(public payload: Currency) {}
}

export class SetExchangeStep implements Action {
  public readonly type = EExchangeActions.SetExchangeStep;

  constructor(public payload: number) {}
}

export class SetAddressOut implements Action {
  public readonly type = EExchangeActions.SetAddressOut;

  constructor(public payload: string) {}
}

export class SetSwapParams implements Action {
  public readonly type = EExchangeActions.SetSwapParams;

  constructor(public payload: any) {}
}

export type ExchangeActions = SetAmountIn | SetAmountInternal | SetAmountOut
  | SetCurrencyIn | SetCurrencyOut | SetExchangeStep | SetAddressOut | SetSwapParams;
