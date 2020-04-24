import {Asset, Server, AssetType, Horizon, StrKey, TransactionBuilder, Account, Networks, Operation, FederationServer} from 'stellar-sdk';
import {reduce, filter} from 'lodash';
import BalanceLine = Horizon.BalanceLine;
import {Currency} from '../../core/currency.interface';

export class StellarService {
  private server = new Server('https://horizon.stellar.org');

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
          issuer: (item.asset_type === 'native' ? null : item.asset_issuer),
          balance: item.balance,
          asset_type: item.asset_type
        };
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async hasTrustline(account: string, currency: Currency) {
    const balances = await this.balances(account);
    return balances.find((balance) => {
      return balance.code === currency.code && balance.issuer === currency.issuer;
    });
  }

  validateAddress(address: string) {
    return StrKey.isValidEd25519PublicKey(address);
  }

  async buildTrustlineTx(account: string, code: string, issuer: string) {
    const feeStats = await this.server.feeStats();
    const sourceAccount = await this.server.loadAccount(account);
    const builder = new TransactionBuilder(
      sourceAccount,
      {
        fee: Math.min(parseInt(feeStats.fee_charged.mode, 10), 10000), // moderate fee, 10000 max
        networkPassphrase: Networks.PUBLIC,
      })
      .setTimeout(600) // 10 min
      .addOperation(Operation.changeTrust({
        asset: new Asset(code, issuer),
      }));

    const tx = builder.build();

    return tx.toEnvelope().toXDR('base64').toString();
  }

  async buildWithdrawalTx(account: string, destination: string, amount: string, code: string, issuer: string) {
    const feeStats = await this.server.feeStats();
    const sourceAccount = await this.server.loadAccount(account);
    const builder = new TransactionBuilder(
      sourceAccount,
      {
        fee: Math.min(parseInt(feeStats.fee_charged.mode, 10), 10000), // moderate fee, 10000 max
        networkPassphrase: Networks.PUBLIC,
      })
      .setTimeout(600) // 10 min
      .addOperation(Operation.payment({
        amount: amount,
        asset: new Asset(code, issuer),
        destination,
      }));

    const tx = builder.build();

    return tx.toEnvelope().toXDR('base64').toString();
  }

  async resolveFederatedAddress(account: string) {
    return FederationServer.resolve(account);
  }
}
