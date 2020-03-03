export interface Currency {
  code: string;
  issuer?: string;
  icon: string;
  withdraw: {
    enabled: boolean,
    fee_fixed: number,
    fee_percent: number,
    min_amount: number,
    fee: string,
  },
}
