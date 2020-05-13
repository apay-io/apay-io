import {Asset, FederationServer, Horizon, Networks, Operation, Server, StrKey, TransactionBuilder, Memo, ServerApi} from 'stellar-sdk';
import {filter, isMatch, reduce, find } from 'lodash';
import {Currency} from '../../core/currency.interface';
import {Observable} from 'rxjs';
import {markets} from '../../../assets/markets';
import {environment} from '../../../environments/environment';
import AccountRecord = ServerApi.AccountRecord;
import BalanceLine = Horizon.BalanceLine;

export interface Balance {
  asset_code: string;
  asset_issuer: string;
  balance: string;
  asset_type: string;
  name?: string;
  image?: string;
  transferServer?: string;
  status?: string;
  color?: string;
}

export class StellarService {
  private server = new Server(environment.horizonUrl);

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

  account(account: string): Observable<AccountRecord> {
    return new Observable((observer) => {
      try {
        this.server.accounts()
          .accountId(account)
          .stream({
            onmessage: (result: AccountRecord) => {
              observer.next(result);
            },
            onerror: observer.error
          });
      } catch (err) {
        console.error(err);
        return observer.next(null);
      }
    });
  }

  balances(account: string): Promise<BalanceLine[]> {
    return this.server.loadAccount(account)
      .then((accountRecord) => accountRecord.balances);
  }

  async hasTrustline(account: string, currency: Currency) {
    const accountRecord = await this.server.loadAccount(account);
    return find(accountRecord.balances, { asset_code: currency.code, asset_issuer: currency.issuer });
  }

  validateAddress(address: string) {
    return StrKey.isValidEd25519PublicKey(address);
  }

  async buildTrustlineTx(account: string, code: string, issuer: string) {
    const sourceAccount = await this.server.loadAccount(account);
    const builder = new TransactionBuilder(
      sourceAccount,
      {
        fee: await this.getModerateFee(),
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
    const sourceAccount = await this.server.loadAccount(account);
    const builder = new TransactionBuilder(
      sourceAccount,
      {
        fee: await this.getModerateFee(),
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

  async resolveFederatedAddress(account: string): Promise<{ accountId: string, memo?: string, memoType?: string }> {
    if (StrKey.isValidEd25519PublicKey(account)) {
      return {
        accountId: account,
      };
    }
    try {
      if (account.indexOf('*') > -1) {
        const fed = await FederationServer.resolve(account);
        return {
          accountId: fed.account_id,
        };
      } else {
        throw new Error('invalid federated address');
      }
    } catch (err) {
      console.log(err);
    }
  }

  async buildContributionTx(memo: string, code: string, baseAmount: string, assetAmount: string) {
    const market = markets[code];
    const user = await this.server.loadAccount(localStorage.getItem('account'));
    const hasTrustline = find(user.balances, { asset_code: `APAY${code}`, asset_issuer: market.manager });

    const txBuilder = new TransactionBuilder(user, {
      fee: await this.getModerateFee(),
      networkPassphrase: Networks.PUBLIC,
      memo: Memo.id(memo)
    });
    if (!hasTrustline) {
      txBuilder.addOperation(Operation.changeTrust({
        asset: new Asset(market.unit, market.manager),
      }));
    }
    txBuilder
      .addOperation(Operation.payment({
        destination: market.manager,
        asset: this.assetFromObject(market.asset),
        amount: assetAmount
      }))
      .addOperation(Operation.payment({
        destination: market.manager,
        asset: this.assetFromObject(market.base),
        amount: baseAmount
      }))
      .setTimeout(1800);
    const tx = txBuilder.build();

    return tx.toEnvelope().toXDR('base64').toString();
  }

  assetFromObject(assetObj): Asset {
    return assetObj.asset_type === 'native' ? Asset.native() : new Asset(assetObj.asset_code, assetObj.asset_issuer);
  }

  async getModerateFee() {
    try {
      const feeStats = await this.server.feeStats();
      return Math.min(parseInt(feeStats.fee_charged.mode, 10), 10000).toString(); // moderate fee, 10000 max
    } catch (err) {
      return '100';
    }
  }

  cursor(account: string): Promise<string> {
    return this.server.payments()
      .forAccount(account)
      .order('desc')
      .limit(15)
      .call()
      .then((result) => {
        if (result.records.length > 0) {
          const lastRecord = result.records.pop();
          return lastRecord.id;
        } else {
          return 'now';
        }
      })
      .catch((err) => {
        return 'now';
      });
  }

  payments(account: string, cursor = null) {
    return new Observable((observer) => {
      try {
        this.server.payments()
          .forAccount(account)
          .cursor(cursor || 'now')
          .join('transactions')
          .limit(50)
          .stream({
            onmessage: async (result: any) => {
              const tx = await result.transaction();
              const memo = localStorage.getItem(`mmbot:${account}`);
              if (memo && tx.memo === memo && find(markets, { manager: result.to })
                || find(markets, { manager: result.from })) {
                observer.next(result);
              }
            },
            onerror: observer.error
          });
      } catch (err) {
        console.error(err);
        return observer.next([]);
      }
    });
  }
}
