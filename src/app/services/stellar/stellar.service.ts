import {Asset, Server} from 'stellar-sdk';
import {reduce, filter} from 'lodash';

export class StellarService {
  private server = new Server('https://horizon.stellar.org');

  async calculateSell(sellCurrency, buyCurrency, buyAmount) {
    const result = await this.server.strictReceivePaths(
      [new Asset(sellCurrency.code, sellCurrency.issuer)],
      new Asset(buyCurrency.code, buyCurrency.issuer),
      buyAmount
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

  async calculateBuy(sellCurrency, sellAmount, buyCurrency) {
    const result = await this.server.strictSendPaths(
      new Asset(sellCurrency.code, sellCurrency.issuer),
      sellAmount,
      [new Asset(buyCurrency.code, buyCurrency.issuer)],
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
}
