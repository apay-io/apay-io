import {ExchangeState, initialExchangeState} from '../states/exchange.state';
import {EExchangeActions, ExchangeActions} from '../actions/exchange.actions';

export function exchangeReducers(
  state = initialExchangeState,
  action: ExchangeActions,
): ExchangeState {
  switch (action.type) {
    case EExchangeActions.SetAmountInternal: {
      state = {
        ...state,
        amountIn: action.payload.amountIn.toString(),
        amountOut: action.payload.amountOut.toString(),
        amountFee: action.payload.amountFee.toString(),
      };
      return state;
    }
    case EExchangeActions.SetCurrencyIn: {
      state = {
        ...state,
        currencyIn: action.payload
      };
      localStorage.setItem('currencyIn', state.currencyIn.code);
      return state;
    }
    case EExchangeActions.SetCurrencyOut: {
      state = {
        ...state,
        currencyOut: action.payload
      };
      localStorage.setItem('currencyOut', state.currencyOut.code);
      return state;
    }
    case EExchangeActions.SetExchangeStep: {
      state = {
        ...state,
        step: action.payload
      };
      return state;
    }
    default:
      return state;
  }
}
