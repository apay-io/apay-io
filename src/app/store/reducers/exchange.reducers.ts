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
        amountIn: action.payload.amountIn,
        amountOut: action.payload.amountOut,
        amountFee: action.payload.amountFee,
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
    case EExchangeActions.SetAddressOut: {
      state = {
        ...state,
        addressOut: action.payload
      };
      localStorage.setItem('account', action.payload);
      return state;
    }
    case EExchangeActions.SetSwapParams: {
      state = {
        ...state,
        addressIn: action.payload.addressIn,
        memoInType: 'ID',
        memoIn: action.payload.addressInExtra,
        id: action.payload.id,
        step: state.step + 1,
      };
      return state;
    }
    default:
      return state;
  }
}
