import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {ModalService} from '../../services/modal/modal.service';
import {FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {StellarService, Balance} from '../../services/stellar/stellar.service';
import {NotifyService} from '../../core/notify.service';
import {currencies} from '../../../assets/currencies-list';
import {markets} from 'src/assets/markets';
import {environment} from '../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import { find, findIndex, mapValues, map } from 'lodash';
import {Observable, Subscription} from 'rxjs';
import {Horizon, ServerApi} from 'stellar-sdk';
import PaymentOperationRecord = ServerApi.PaymentOperationRecord;
import { BigNumber } from 'bignumber.js';
import AccountRecord = ServerApi.AccountRecord;
import BalanceLineAsset = Horizon.BalanceLineAsset;

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.scss']
})

export class SavingsComponent implements OnInit, OnDestroy {
  displayedColumns = ['image', 'code', 'balance', 'percent', 'value', 'actions'];
  markets = markets;

  dataSource;

  account$: Observable<AccountRecord>;

  description = 'Add required trustline and send funds';
  code: string;
  xdr: string;
  rate: string;
  isLoading = false;
  private assetBalance: any;
  private baseBalance: any;
  private tokensBalance: any;

  assetAmountControl = new FormControl(
    '', [
      (control) => {
        return this.assetBalance && parseFloat(control.value) > parseFloat(this.getAvailableBalance(this.code)) ?
          { max: 'Specified amount exceeds available balance' } : null;
      }
    ]
  );
  baseAmountControl = new FormControl(
    '', [
      (control) => {
        return this.baseBalance && parseFloat(control.value) > parseFloat(this.baseBalance.balance) ?
          { max: 'Specified amount exceeds available balance' } : null;
      }
    ]
  );
  tokensAmountControl = new FormControl(
    '', [
      (control) => {
        return this.tokensBalance && parseFloat(control.value) > parseFloat(this.tokensBalance.balance) ?
          { max: 'Specified amount exceeds available balance' } : null;
      }
    ]
  );
  private mmSub: Subscription;
  account = localStorage.getItem('account');
  memoId = this.account ? localStorage.getItem(`mmbot:${this.account}`) : null;
  incomingOps = [];
  termsAccepted = false;
  private balances: Horizon.BalanceLine[];

  constructor(private readonly http: HttpClient,
              private readonly stellarService: StellarService,
              public modalService: ModalService,
              private notify: NotifyService) {
    this.account$ = this.stellarService.account(this.account);
    for (const currencyMeta of currencies) {
      if (this.markets[currencyMeta.code]) {
        this.markets[currencyMeta.code] = {
          ...this.markets[currencyMeta.code],
          ...currencyMeta,
        };
      }
    }
  }

  ngOnInit() {
    this.account$.subscribe((account: AccountRecord) => {
      this.balances = account.balances;
      for (const balance of account.balances) {
        const asset = (balance as BalanceLineAsset).asset_code;
        if (asset && asset.indexOf('APAY') === 0) {
          this.markets[asset.substr(4)].balance = balance.balance;
        }
      }
    });
    this.fetchMMStats();
    this.stellarService.cursor(this.account)
      .then((cursor) => {
        this.stellarService.payments(this.account, cursor)
          .subscribe((payment: PaymentOperationRecord) => {
            const market = find(this.markets, { manager: payment.from });
            let index = findIndex(this.incomingOps, { to: payment.from });
            if (index !== -1) {
              // removing processed txns
              this.incomingOps.splice(index, 1);
            }
            if (market) {
              return;
            }
            index = findIndex(this.incomingOps, { to: payment.to });
            if (index === -1) {
              index = this.incomingOps.length;
              this.incomingOps[index] = {
                to: payment.to,
                ops: []
              };
            }
            this.incomingOps[index].ops.push({
              id: payment.id,
              asset_code: payment.asset_code || 'XLM',
              amount: payment.amount,
            });
          });
      });

    // this.code$.subscribe(async (code) => {
    //   this.xdr = await this.stellarService.buildContributionTx(code);
    // });
  }

  ngOnDestroy() {
    console.log('destroy');
  }

  private fetchMMStats() {
    if (this.memoId) {
      this.http.get(`${environment.botApi}/stats?account=${this.memoId}`).toPromise()
        .then((result: any) => {
          for (const item of result) {
            this.markets[item.asset].baseValue = parseFloat(item.accountBase) * 2;
            if (this.markets[item.asset].baseValue) {
              this.markets[item.asset].value = parseFloat(item.accountTokens) * parseFloat(item.unitPriceBase) * 2;
              this.markets[item.asset].percent = (this.markets[item.asset].value / this.markets[item.asset].baseValue - 1) * 100;
            }
            this.markets[item.asset].baseBalance = parseFloat(new BigNumber(item.issued).mul(item.unitPriceBase).toPrecision(4))
              .toLocaleString();
            this.markets[item.asset].assetBalance = parseFloat(new BigNumber(item.issued).mul(item.unitPriceAsset).toPrecision(4))
              .toLocaleString();
            this.markets[item.asset].rate = parseFloat(new BigNumber(item.unitPriceBase).dividedBy(item.unitPriceAsset).toPrecision(4));
          }
          this.dataSource = new MatTableDataSource(Object.values(this.markets));
        });
    } else {
      this.dataSource = new MatTableDataSource(Object.values(this.markets));
    }
  }

  getBalance(code: string) {
    return this.markets[code].balance;
  }

  hasTrustline(code: string) {
    return this.markets[code].balance;
  }

  async addFunds(code: string) {
    this.code = code;
    this.assetBalance = find(this.balances,
      code === 'XLM' ? { asset_type: 'native'} : {asset_code: code, asset_issuer: this.markets[code].asset.asset_issuer
    });
    this.baseBalance = find(this.balances, {asset_code: 'USDT', asset_issuer: this.markets[code].base.asset_issuer});
    this.baseAmountControl.setValue('');
    this.assetAmountControl.setValue('');
    this.modalService.open('contribute');
    this.registerAccount();
  }

  private registerAccount() {
    const account = localStorage.getItem('account');
    if (!this.memoId) {
      this.http.post(`${environment.botApi}/account`, {
        account,
      }).toPromise()
        .then((response: any) => {
          this.memoId = response.id;
          localStorage.setItem(`mmbot:${account}`, response.id);
        });
    }
  }

  redeem(code: string) {
    this.code = code;
    this.tokensBalance = find(this.balances, { asset_code: `APAY${code}`});
    this.tokensAmountControl.setValue('');
    this.modalService.open('redeem');
    this.registerAccount();
  }

  updateBaseAmount(baseAmount) {
    if (baseAmount) {
      this.baseAmountControl.setValue(baseAmount);
      this.assetAmountControl.setValue((this.baseAmountControl.value / parseFloat(this.markets[this.code].rate)).toFixed(7));
    } else {
      this.baseAmountControl.setValue('');
      this.assetAmountControl.setValue('');
    }
    this.updateXdr();
  }

  updateAssetAmount(assetAmount) {
    if (assetAmount) {
      this.assetAmountControl.setValue(assetAmount);
      this.baseAmountControl.setValue((this.assetAmountControl.value * parseFloat(this.markets[this.code].rate)).toFixed(7));
    } else {
      this.baseAmountControl.setValue('');
      this.assetAmountControl.setValue('');
    }
    this.updateXdr();
  }

  updateTokensAmount(tokensAmount) {
    this.tokensAmountControl.setValue(tokensAmount);
    this.updateRedeemXdr();
  }

  async updateXdr() {
    const account = localStorage.getItem('account');
    if (this.baseAmountControl.value && !this.baseAmountControl.invalid
      && this.assetAmountControl.value && !this.assetAmountControl.invalid && this.markets[this.code]
      && account && localStorage.getItem(`mmbot:${account}`)) {
      this.xdr = await this.stellarService.buildContributionTx(
        localStorage.getItem(`mmbot:${account}`),
        this.code,
        this.baseAmountControl.value,
        this.assetAmountControl.value
      );
    } else {
      this.xdr = null;
    }
  }

  async updateRedeemXdr() {
    const account = localStorage.getItem('account');
    if (this.tokensAmountControl.value && !this.tokensAmountControl.invalid && this.markets[this.code]
      && account && this.memoId) {
      this.xdr = await this.stellarService.buildRedemptionTx(
        this.memoId,
        this.code,
        this.tokensAmountControl.value,
      );
    } else {
      this.xdr = null;
    }
  }

  closeContributeModal() {
    this.xdr = null;
    this.assetBalance = null;
    this.modalService.close('contribute');
  }

  apply(market: any) {
    this.http.post(`${environment.botApi}/deposit`, {
      memo: this.memoId,
      txs: market.ops.map((op) => op.id),
    }).toPromise()
      .then((result) => {
        this.fetchMMStats();
      });
  }

  refund(market: any) {

  }

  getAvailableBalance(code: string) {
    if (code === 'XLM') {
      return new BigNumber(this.assetBalance.balance).minus(10).toFixed(7);
    }
    return this.assetBalance.balance;
  }

  closeRedeemModal() {
    this.xdr = null;
    this.tokensBalance = null;
    this.modalService.close('redeem');
  }
}
