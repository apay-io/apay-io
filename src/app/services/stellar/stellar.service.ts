import {Asset, Server, AssetType, Horizon} from 'stellar-sdk';
import {reduce, filter} from 'lodash';
import BalanceLine = Horizon.BalanceLine;

export class StellarService {
  private server = new Server('https://horizon.stellar.org');
  knownIssuers = [
    'GAUTUYY2THLF7SGITDFMXJVYH3LHDSMGEAKSBU267M2K7A3W543CKUEF',
    'GC5LOR3BK6KIOK7GKAUD5EGHQCMFOGHJTC7I3ELB66PTDFXORC2VM5LP',
    'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
  ];

  async calculateSell(currencyIn, currencyOut, amountOut) {
    const result = await this.server.strictReceivePaths(
      [new Asset(currencyIn.code, currencyIn.issuer)],
      new Asset(currencyOut.code, currencyOut.issuer),
      amountOut
    ).call();
    const records = filter(result.records, (record) => record.path.length <= 1);
    if (records.length > 0) {
      return reduce(records, (acc, record) => {
        return parseFloat(record.source_amount) < parseFloat(acc.source_amount) ? record : acc;
      });
    } else {
      throw new Error('Unable to find path');
    }
  }

  async calculateBuy(currencyIn, amountIn, currencyOut) {
    const result = await this.server.strictSendPaths(
      new Asset(currencyIn.code, currencyIn.issuer),
      amountIn,
      [new Asset(currencyOut.code, currencyOut.issuer)],
    ).call();
    const records = filter(result.records, (record) => record.path.length <= 1);
    if (records.length > 0) {
        return reduce(records, (acc, record) => {
          return parseFloat(record.destination_amount) > parseFloat(acc.destination_amount) ? record : acc;
      });
    } else {
      throw new Error('Unable to find path');
    }
  }

  async balances(account: string) {
    try {
      const result = await this.server.loadAccount(account);
      return result.balances
        .map((item: BalanceLine) => {
        return {
          code: (item.asset_type === 'native' ? 'XLM' : item.asset_code),
          balance: item.balance,
          asset_type: item.asset_type
        };
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
