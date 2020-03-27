import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {Color} from 'ng2-charts';
import * as moment from 'moment';
import {ModalService} from '../../services/modal/modal.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StellarService} from '../../services/stellar/stellar.service';
import {NotifyService} from '../../core/notify.service';
import {currencies} from '../../../assets/currencies-list';
import {Currency} from '../../core/currency.interface';
import {environment} from "../../../environments/environment";

export interface Data {
  date: string;
  val: string;
}

interface Token extends Currency {
  balance: string;
  baseUrl: string;
  trustline: boolean;
}

@Component({
  selector: 'app-convert-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})

export class AccountPageComponent implements OnInit, OnDestroy {
  dataWallet = Object.assign([], currencies);
  rates = {};
  isLoading = false;
  buttonText;
  percent: number;
  sumValue = 0;
  sumChange = 0;
  hideLowBalanceFlag: boolean;
  searchValue: string;
  arraySearchValue = [];
  address: string;
  txId: string;
  currentToken: Token = {
    code: '',
    name: '',
    icon: '',
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
    baseUrl: '',
    trustline: false
  };
  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';

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
      borderColor: '#0f59d1',
      backgroundColor: '#0f59d11f',
    },
  ];

  datasets: any[] = [
    {
      backgroundColor: []
    }
  ];

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
    new Promise((res) => {
      this.http.get(`${environment.backend}/rates?first=1&order[field]=at&order[order]=DESC`).subscribe((data) => {
        res(data);
      });
    })
      .then((result: any) => {
        const rates = result.edges[0].node.rates;
        console.log('RATES');
        console.log(rates);
        this.arraySearchValue = this.dataWallet;
        this.account = localStorage.getItem('account');
        if (this.account) {
          this.stellarService.balances(this.account)
            .then((result) => {
              result.map(balanceLine => {
                let dataToken;
                const findIndexToken = this.dataWallet.findIndex(x => x.code === balanceLine.code);
                if (findIndexToken !== -1) {
                  this.dataWallet.unshift(...this.dataWallet.splice(findIndexToken, 1));
                  dataToken = this.dataWallet.find(x => x.code === balanceLine.code);
                  dataToken.balance = balanceLine.balance;
                  dataToken.trustline = true;
                  if (rates[balanceLine.code]) {
                    dataToken.value = +(+balanceLine.balance / rates[balanceLine.code] * rates['XDR']).toFixed(6);
                    this.sumValue = +(this.sumValue + dataToken.value).toFixed(6);
                  }

                  this.datasets[0].backgroundColor.unshift(dataToken.color);
                } else {
                  dataToken = {
                    'code': balanceLine.code,
                    'name': balanceLine.code,
                    'baseUrl': 'https://api.apay.io/api',
                    'icon': '',
                    'balance': balanceLine.balance,
                    'percent': '-',
                    'value': 0,
                    'change': '0',
                    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                    'deposit': 'active',
                    'withdraw': 'active',
                    'color': '#a39ca0',
                    'trustline': true
                  };

                  if (rates[balanceLine.code]) {
                    dataToken.value = +(+balanceLine.balance / rates[balanceLine.code] * rates['XDR']).toFixed(6);
                    this.sumValue = +(this.sumValue + dataToken.value).toFixed(6);
                  }
                  this.dataWallet.unshift(dataToken);
                }
              });
              this.percent = 100 / this.sumValue;
              this.drawingCharts(this.dataWallet[0].code, this.dataWallet[0].issuer, 30, 'days');

              this.dataWallet.map((item) => {
                if (item.balance && item.value) {
                  item.percent = (this.percent * item.value).toFixed(2);
                  this.doughnutChartData.push(item.percent);
                  this.doughnutChartLabels.push(item.code);
                  this.sumChange += +item.change;
                }
              });
            });
        }
      })
      .catch(error => {
        console.log('ERROR:', error.message);
      });
  }

  ngOnDestroy() {
    this.dataWallet = Object.assign([], currencies);
  }

  drawingCharts(assetCode: string, assetIssuer: string, time_amount: number, time_type: string) {
    this.drawingChart(assetCode, time_amount, time_type);
    this.drawingBalanceChart(assetCode, assetIssuer);
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
        this.txId = await this.stellarService.buildTrustlineTx(this.account, this.currentToken.code, this.currentToken.issuer);
        this.description = `You are going to establish a trustline for asset ${this.currentToken.code} issued by apay.io`;
        this.modalService.open('prepare-transaction');
        return false;
      }
      this.modalService.open(modalName);
      if (item.stellarNative) {
        this.address = this.account;
        return false;
      }
      this.getToken(item.code, item.baseUrl);
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
    this.txId = await this.stellarService.buildWithdrawalTx(
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
    if (event.checked) {
      this.hideLowBalanceFlag = true;
      localStorage.setItem('hideLowBalanceFlag', 'true');
      return false;
    }
    this.hideLowBalanceFlag = false;
    localStorage.setItem('hideLowBalanceFlag', 'false');
  }

  search() {
    if (this.searchValue.length < 2) {
      this.arraySearchValue = this.dataWallet;
      return false;
    }

    this.searchValue = this.searchValue[0].toUpperCase() + this.searchValue.slice(1);
    this.arraySearchValue = this.dataWallet.filter(
      item => (item.name.indexOf(this.searchValue) > -1) || (item.code.indexOf(this.searchValue.toUpperCase()) > -1)
    );
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

}
