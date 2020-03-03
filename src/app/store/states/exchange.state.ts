import {currencies} from '../../../assets/currencies-list';
import {Currency} from '../../core/currency.interface';

export interface ExchangeState {
  id?: string;
  addressIn?: string;
  memoIn?: string;
  memoInType?: string;
  addressOut: string;
  amountIn: string;
  amountOut: string;
  amountFee: string;
  currencyIn: Currency;
  currencyOut: Currency;
  step: number;
}

export const initialExchangeState: ExchangeState = {
  addressOut: localStorage.getItem('account'),
  amountIn: sessionStorage.getItem('amountIn'),
  amountOut: sessionStorage.getItem('amountOut'),
  amountFee: '',
  currencyIn: currencies
    .find((item) => item.code === (localStorage.getItem('currencyIn') || 'XLM')),
  currencyOut: currencies
    .find((item) => item.code === (localStorage.getItem('currencyOut') || 'BTC')),
  step: 1,
};
