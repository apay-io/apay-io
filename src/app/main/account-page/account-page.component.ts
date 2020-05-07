import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {Color} from 'ng2-charts';
import * as moment from 'moment';
import {ModalService} from '../../services/modal/modal.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StellarService, Balance} from '../../services/stellar/stellar.service';
import {NotifyService} from '../../core/notify.service';
import {currencies} from '../../../assets/currencies-list';
import {Currency} from '../../core/currency.interface';
import {environment} from '../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {isEqual, pick, map, find, findIndex} from 'lodash';
import {markets} from '../../../assets/markets';

export interface Data {
  date: string;
  val: string;
}

interface Token extends Currency {
  balance: string;
  transferServer: string;
  trustline: boolean;
}

@Component({
  selector: 'app-convert-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})

export class AccountPageComponent implements OnInit {
  dataWallet = JSON.parse(JSON.stringify(currencies));
  dataSource = new MatTableDataSource(this.dataWallet);
  displayedColumns = ['image', 'code', 'balance', 'percent', 'value', 'actions'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  rates = {};
  isLoading = false;
  buttonText;
  percent: number;
  sumValue = 0;
  hideLowBalanceFlag: boolean;
  searchValue: string;
  arraySearchValue = [];
  address: string;
  xdr: string;
  currentToken: Token = {
    code: '',
    name: '',
    image: '',
    balance: '',
    deposit: {
      enabled: true,
      fee_fixed: 0,
      fee_percent: 0,
      min_amount: 0,
      fee: ''
    },
    withdraw: {
      enabled: true,
      fee_fixed: 0,
      fee_percent: 0,
      min_amount: 0,
      fee: ''
    },
    stellarNative: false,
    transferServer: '',
    trustline: false
  };
  public doughnutChartLabels = [];
  public doughnutChartData = [];

  public ChartLabels = [];
  public ChartData = [];
  public debounceFlag = false;
  public ChartType = 'line';
  private account: string;

  public balanceDebounceFlag = false;
  public balanceChartLabels = [];
  public balanceChartData = [];

  withdrawForm: FormGroup;
  regexpAmount = /^[0-9]*[.,]?[0-9]+$/;
  public description: string;
  public balances: Balance[];
  meta = JSON.parse(sessionStorage.getItem('assets-meta') || '{}');

  constructor(private readonly http: HttpClient,
              public readonly appComponent: AppComponent,
              private readonly stellarService: StellarService,
              public modalService: ModalService,
              private notify: NotifyService) {
    this.hideLowBalanceFlag = localStorage.getItem('hideLowBalanceFlag') === 'true';
    this.withdrawForm = new FormGroup({
      recipient: new FormControl('', [
        Validators.required,
      ]),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern(this.regexpAmount)
      ])
    });
  }

  barChartColors: Color[] = [
    {
      borderColor: '#2196F3',
      backgroundColor: '#2196F31f',
    },
  ];

  datasets: any[] = [];

  public doughnutChartOptions: any = {
    legend: {
      display: false,
    },
    responsive: true,
    cutoutPercentage: 75,
    'onClick' : function (evt, item) {
      console.log ('legend onClick', evt);
      console.log('legd item', item);
    }
  };

  public barChartOptions: any = {
    legend: {
      display: false,
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    scaleShowVerticalLines: false,
    responsive: true,
    scaleOverride: true,
    scales: {
      xAxes: [{
        ticks: {
          fontColor: '#a5a5a5',
          maxTicksLimit: 6,
          maxRotation: 0,
        },
        type: 'time',
        time: {
          // unit: "month"
          tooltipFormat: 'll',
        },
        gridLines: {
          display: false,
          color: '#FFFFFF'
        },
      }],
      yAxes: [{
        ticks: {
          fontColor: '#a5a5a5',
          maxTicksLimit: 5,
        },
        gridLines: {
          display: false,
          color: '#FFFFFF'
        },
      }]
    },
    tooltips: {
      position: 'nearest',
      mode: 'index',
      intersect: false,
    },
  };

  ngOnInit() {
    this.http.get(`https://rates.apay.io`).toPromise()
      .then((rates: any) => {
        this.rates = rates;
        this.account = localStorage.getItem('account');
        if (this.account) {
          this.stellarService.balances(this.account)
            .subscribe((balances) => {
              this.balances = balances.map(v => {
                return {
                  ...v,
                  ...this.meta[`${v.asset_code}:${v.asset_issuer}`],
                };
              });
              const missingMeta = this.balances.filter((balance) => {
                return balance.asset_type !== 'native' && !balance.image && !balance.asset_code.startsWith('APAY');
              });
              if (missingMeta.length > 0) {
                this.http.post('https://stellar-asset-meta.apay.workers.dev',
                  missingMeta.map(balance => pick(balance, ['asset_code', 'asset_issuer']))
                ).toPromise()
                  .then((meta) => {
                  this.meta = meta;
                  sessionStorage.setItem('assets-meta', JSON.stringify(meta));
                  this.refreshTable();
                });
              }
              this.refreshTable();
            });
        }
      })
      .catch(error => {
        console.log('ERROR:', error.message);
      });
  }

  drawingCharts(assetCode: string, assetIssuer: string, time_amount: number, time_type: string) {
    // this.drawingChart(assetCode, time_amount, time_type);
    // this.drawingBalanceChart(assetCode, assetIssuer);
  }

  drawingChart(select_val, time_amount, time_type) {
    const nowtime = moment().format('YYYY-MM-DD');
    const time = moment().subtract(time_amount, time_type).format('YYYY-MM-DD');
    this.updateChart(select_val, time, nowtime);
  }

  updateChart(select_val, time, nowtime) {
    if (this.debounceFlag) {
      return false;
    }
    this.debounceFlag = true;
    this.ChartLabels = [];
    this.ChartData = [];
    setTimeout(() => {
      this.debounceFlag = false;
    }, 1000);
    return this.http.get(`${environment.backend}/rateHistory?currency=${select_val}&order[field]=at&order[order]=ASC&fromAt=${time}&toAt=${nowtime}`)
      .subscribe((result: any) => {
        result.edges.map(edge => {
          const item = edge.node;
          this.ChartLabels.push(item.at);
          let reductionValue;
          if (item.rate.length > 7) {
            reductionValue = +item.rate;
            reductionValue = reductionValue.toFixed(5);
          } else {
            reductionValue = item.rate;
          }
          this.ChartData.push(reductionValue);
        });
      });
  }

  drawingBalanceChart(assetCode: string, assetIssuer: string) {
    console.log(`drawingBalanceChart(${assetCode}, ${assetIssuer}), account: ${this.account}`);
    if (this.balanceDebounceFlag) {
      return false;
    }
    this.balanceDebounceFlag = true;
    this.balanceChartLabels = [];
    this.balanceChartData = [];
    setTimeout(() => {
      this.balanceDebounceFlag = false;
    }, 1000);
    this.http.get(
      `${environment.backend}/dailyBalances`,
      {params: {
          accountId: this.account,
          'asset[code]': (assetCode === 'XLM' && !assetIssuer) ? 'native' : assetCode,
          'asset[issuer]': assetIssuer,
        }
      }
    ).subscribe(
      (data: any) => {
        data.edges.map(edge => {
          this.balanceChartData.push(edge.node.amount);
          this.balanceChartLabels.push(edge.node.date);
        });
      },
      (error) => console.log(error),
    );
  }

  async openModal(event, item, modalName) {
    event.stopPropagation();
    this.currentToken = item;
    if (item.balance === '0' && modalName === 'withdraw' ||
      !this.currentToken.deposit.enabled && modalName === 'deposit' ||
      !this.currentToken.withdraw.enabled && modalName === 'withdraw') {
      return false;
    }
    if (modalName === 'deposit') {
      if (!this.currentToken.trustline) {
        this.xdr = await this.stellarService.buildTrustlineTx(this.account, this.currentToken.code, this.currentToken.issuer);
        this.description = `You are going to establish a trustline for asset ${this.currentToken.code} issued by apay.io`;
        this.modalService.open('prepare-transaction');
        return false;
      }
      this.modalService.open(modalName);
      if (item.stellarNative) {
        this.address = this.account;
        return false;
      }
      this.getToken(item.code, item.transferServer);
    }
    if (modalName === 'withdraw') {
      this.modalService.open(modalName);
      this.withdrawForm.reset();
      this.buttonText = 'Prepare transaction';

      this.withdrawForm.controls['amount'].setValidators([
        Validators.required,
        Validators.max(+this.currentToken.balance),
        Validators.min(+this.currentToken.withdraw.min_amount),
        Validators.pattern(this.regexpAmount)
      ]);
    }
  }

  get _amount() {
    return this.withdrawForm.get('amount');
  }

  async sendWithdrawForm() {
    this.xdr = await this.stellarService.buildWithdrawalTx(
      this.account,
      this.withdrawForm.controls.recipient.value,
      this.withdrawForm.controls.amount.value,
      this.currentToken.code,
      this.currentToken.issuer,
    );
    this.modalService.close('withdraw');
    this.description = `You are going to send ${this.withdrawForm.controls.amount.value} ${this.currentToken.code}`;
    this.modalService.open('prepare-transaction');
  }

  isHideLowBalanceCheckbox(event) {
    this.hideLowBalanceFlag = event.checked;
    localStorage.setItem('hideLowBalanceFlag', event.checked);
    this.refreshTable();
  }

  search() {
    this.dataSource.filter = this.searchValue.toLowerCase().trim();
  }

  addFullBalance(balance) {
    this.withdrawForm.controls['amount'].setValue(balance);
  }

  getToken (code, baseUrl) {
    this.address = '';
    return this.http.get(`${baseUrl}/deposit?account=${this.account}&asset_code=${code}`)
      .subscribe((data) => {
      this.address = data['how'];
      if (this.address.indexOf('address') !== -1) {
        this.address = this.address.split('address: ')[1];
      }
    });
  }

  private refreshTable() {
    this.sumValue = 0;
    this.balances.map(balanceLine => {
      if (find(markets, { unit: balanceLine.asset_code, manager: balanceLine.asset_issuer })) {
        return;
      }
      let index = findIndex(this.dataWallet, { code: balanceLine.asset_code, issuer: balanceLine.asset_issuer });
      let dataToken = this.dataWallet[index];
      if (!dataToken) {
        dataToken = {
          code: balanceLine.asset_code,
          issuer: balanceLine.asset_issuer,
          name: balanceLine.name || '',
          transferServer: balanceLine.transferServer,
          image: balanceLine.image,
          'balance': balanceLine.balance,
          'deposit': !balanceLine.status || balanceLine.status === 'live' ? 'active' : 'inactive',
          'withdraw': !balanceLine.status || balanceLine.status === 'live' ? 'active' : 'inactive',
        };
        index = this.dataWallet.length;
      }
      dataToken.balance = balanceLine.balance;
      dataToken.trustline = true;
      if (balanceLine.asset_code === 'USDT') {
        dataToken.value = parseFloat(balanceLine.balance);
        this.sumValue = +(this.sumValue + dataToken.value);
      } else if (this.rates[balanceLine.asset_code]) {
        dataToken.value = +(+balanceLine.balance / this.rates[balanceLine.asset_code]);
        this.sumValue = +(this.sumValue + dataToken.value);
      }
      this.dataWallet[index] = {
        ...dataToken,
        ...this.meta[`${dataToken.code}:${dataToken.issuer}`],
      };
    });
    this.percent = 100 / this.sumValue;
    this.sumValue = Math.round(this.sumValue * 100) / 100;

    this.dataWallet.map((item) => {
      if (item.balance && item.value) {
        item.percent = (this.percent * item.value).toFixed(2);
      }
    });
    this.doughnutChartLabels = map(this.dataWallet, 'code');
    const chartData = map(this.dataWallet, 'value');
    if (!this.datasets[0] || !isEqual(this.datasets[0].data, chartData)) {
      this.datasets = [{
        data: chartData,
        backgroundColor: map(this.dataWallet, 'color'),
      }];
    }
    this.dataSource.data = this.hideLowBalanceFlag ?
      this.dataWallet.filter((item) => parseFloat(item.balance) > 1e-7) : this.dataWallet;
    this.dataSource.sort = this.sort;
  }
}
