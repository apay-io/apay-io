export interface Currency {
  code: string;
  name: string;
  issuer?: string;
  image: string;
  deposit: {
    enabled: boolean,
    fee_fixed: number,
    fee_percent: number,
    min_amount: number,
    fee: string,
  },
  withdraw: {
    enabled: boolean,
    fee_fixed: number,
    fee_percent: number,
    min_amount: number,
    fee: string,
  };
  stellarNative: boolean;
}
