import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
import { find, findIndex } from 'lodash';
import {Subscription} from 'rxjs';
import {ServerApi} from 'stellar-sdk';
import OperationRecord = ServerApi.OperationRecord;
import PaymentOperationRecord = ServerApi.PaymentOperationRecord;

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.scss']
})

export class SavingsComponent implements OnInit {
  displayedColumns = ['image', 'code', 'balance', 'percent', 'value', 'actions'];
  markets = markets.map((market) => {
    return {
      ...market,
      ...currencies.find((item) => item.code === market.asset.asset_code
        || item.code === 'XLM' && market.asset.asset_type === 'native'),
      percent: null,
      value: null,
      baseValue: null,
    };
  });
  dataSource;

  @Input()
  balances;

  description = 'Add required trustline and send funds';
  code: string;
  xdr: string;
  rate: string;
  mmTotal: { rate: string; asset: string; base: string, market: any };
  isLoading = false;
  private assetBalance: any;
  private baseBalance: any;
  assetAmountControl = new FormControl(
    '', [
      (control) => {
        return this.assetBalance && parseFloat(control.value) > parseFloat(this.assetBalance.balance) ?
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
  private mmSub: Subscription;
  account = localStorage.getItem('account');
  memoId = this.account ? localStorage.getItem(`mmbot:${this.account}`) : null;
  incomingOps = [];
  termsAccepted = false;

  constructor(private readonly http: HttpClient,
              private readonly stellarService: StellarService,
              public modalService: ModalService,
              private notify: NotifyService) {
  }

  ngOnInit() {
    // this.http.get(`${environment.botApi}/`).toPromise()
    //   .then((result) => {
    //     this.dataSource = [];
    //   });
    this.fetchMMStats();
    this.stellarService.cursor(this.account)
      .then((cursor) => {
        this.stellarService.payments(this.account, this.markets, cursor)
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

  private fetchMMStats() {
    if (this.memoId) {
      this.http.get(`${environment.botApi}/stats?account=${this.memoId}`).toPromise()
        .then((result: any) => {
          for (const item of result) {
            const index = findIndex(this.markets, { unit: `APAY${item.asset}` });
            this.markets[index].baseValue = parseFloat(item.baseTotal) * 2;
            this.markets[index].value = parseFloat(item.tokensTotal) * parseFloat(item.unitPriceBase) * 2;
            this.markets[index].percent = (this.markets[index].value / this.markets[index].baseValue - 1) * 100;
            this.dataSource = new MatTableDataSource(this.markets);
          }
        });
    } else {
      this.dataSource = new MatTableDataSource(this.markets);
    }
  }

  getBalance(code: string) {
    const trustline = this.hasTrustline(code);
    return trustline && trustline.balance;
  }

  getChange(code: string) {
    return '';
  }

  getValue(code: string) {
    return '';
  }

  hasTrustline(code: string) {
    return this.balances && find(this.balances, { asset_code: `APAY${code}` });
  }

  async addFunds(code: string) {
    this.code = code;
    this.baseAmountControl.setValue('');
    this.assetAmountControl.setValue('');
    this.modalService.open('contribute');
    this.registerAccount();
    this.mmSub = this.stellarService.calculateMMRate(code)
      .subscribe(mmTotal => {
        if (!this.mmTotal || this.mmTotal.base !== mmTotal.base) {
          this.mmTotal = mmTotal;
          this.assetBalance = find(this.balances, {asset_code: code, asset_issuer: mmTotal.market.asset.asset_issuer});
          this.baseBalance = find(this.balances, {asset_code: 'USDT', asset_issuer: mmTotal.market.base.asset_issuer});
          this.updateXdr();
        }
      });
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
    console.log(code);
  }

  updateBaseAmount(baseAmount) {
    if (baseAmount) {
      this.baseAmountControl.setValue(baseAmount);
      this.assetAmountControl.setValue((this.baseAmountControl.value / parseFloat(this.mmTotal.rate)).toFixed(7));
    } else {
      this.baseAmountControl.setValue('');
      this.assetAmountControl.setValue('');
    }
    this.updateXdr();
  }

  updateAssetAmount(assetAmount) {
    if (assetAmount) {
      this.assetAmountControl.setValue(assetAmount);
      this.baseAmountControl.setValue((this.assetAmountControl.value * parseFloat(this.mmTotal.rate)).toFixed(7));
    } else {
      this.baseAmountControl.setValue('');
      this.assetAmountControl.setValue('');
    }
    this.updateXdr();
  }

  async updateXdr() {
    const account = localStorage.getItem('account');
    if (this.baseAmountControl.value && !this.baseAmountControl.invalid
      && this.assetAmountControl.value && !this.assetAmountControl.invalid && this.mmTotal
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

  closeContributeModal() {
    this.mmSub.unsubscribe();
    this.modalService.close('contribute');
  }

  apply(market: any) {
    this.http.post(`${environment.botApi}/deposit`, {
      memo: this.memoId,
      txs: market.ops.map((op) => op.id),
    }).toPromise()
      .then((result) => {
      });
  }

  refund(market: any) {

  }
}
