import {Currency} from './currency.interface';

export interface Exchange {
  amountIn: string;
  amountOut: string;
  currencyIn: Currency;
  currencyOut: Currency;
  step: number;
}
