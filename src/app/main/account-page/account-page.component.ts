import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {accountData} from '../../../assets/accountData';
import {Color} from 'ng2-charts';
import * as moment from 'moment';
import {ModalService} from "../../services/modal/modal.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StellarService} from '../../services/stellar/stellar.service';
import {NotifyService} from "../../core/notify.service";

export interface Data {
  date: string;
  val: string;
}

interface Token {
  code: string,
  name: string,
  icon: string,
  balance: string,
  deposit: string,
  withdraw: string,
  baseUrl: string,
  trustline: boolean,
}

@Component({
  selector: 'app-convert-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})

export class AccountPageComponent implements OnInit {
  dataWallet = accountData;
  rates = {};
  isLoading = false;
  buttonText;
  percent: number;
  sumValue: number = 0;
  sumChange: number = 0;
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
    deposit: 'active',
    withdraw: 'active',
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
  public withdrawToken = {
    'fee_percent': 0,
    'fee_fixed': 0,
    'min_amount': 0
  };

  withdrawForm: FormGroup;
  regexpAmount = /^[0-9]*[.,]?[0-9]+$/;

  constructor(private readonly http: HttpClient,
              public readonly appComponent: AppComponent,
              private readonly stellarService: StellarService,
              public modalService: ModalService,
              private notify: NotifyService) {
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
    this.http.get(`https://rates.apay.io`).subscribe((data) => {
      this.rates = data;
    });

    this.arraySearchValue = this.dataWallet;
    this.account = localStorage.getItem('account');
    if (this.account) {
      this.stellarService.balances(this.account)
        .then((result) => {
          result.map(item => {
            const findIndexToken = this.dataWallet.findIndex(x => x.code === item.code);
            if (findIndexToken !== -1) {
              this.dataWallet.unshift(...this.dataWallet.splice(findIndexToken,1));
              const findToken = this.dataWallet.find(x => x.code === item.code);
              findToken.balance = item.balance;
              findToken.trustline = true;
              if (this.rates[item.code]) {
                findToken.value = +(+item.balance / this.rates[item.code] * this.rates['XDR']).toFixed(6);
                this.sumValue = +(this.sumValue + findToken.value).toFixed(6);
              }

              this.datasets[0].backgroundColor.unshift(findToken.color);
            } else {
              const dataToken = {
                'code': item.code,
                'name': item.code,
                'baseUrl': 'https://api.apay.io/api',
                'icon': '',
                'balance': item.balance,
                'percent': '-',
                'value': 0,
                'change': '0',
                'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                'deposit': 'active',
                'withdraw': 'active',
                'color': '#a39ca0',
                'address': 'native',
                'trustline': true
              }

              if (this.rates[item.code]) {
                dataToken.value = +(+item.balance / this.rates[item.code] * this.rates['XDR']).toFixed(6);
              }
              this.dataWallet.unshift(dataToken);
            }
          });
          this.percent = 100 / this.sumValue;
          this.drawingChart('AED', 30, 'days');
            console.warn(this.dataWallet);

            setTimeout(() => {

                this.dataWallet.map((item) => {
                    if (item.balance && item.value) {
                        item.percent = (this.percent * item.value).toFixed(2);
                        this.doughnutChartData.push(item.percent);
                        this.doughnutChartLabels.push(item.code);
                        this.sumChange += +item.change;
                    }
                });
                console.warn(this.doughnutChartData);
                console.warn(this.doughnutChartLabels);
            }, 1000);
        });
    }
  }

  async drawingChart(select_val, time_amount, time_type) {
    const nowtime = moment().format('YYYY-MM-DD');
    const time = moment().subtract(time_amount, time_type).format('YYYY-MM-DD');
    await this.updateChart(select_val, time, nowtime);
  }

  async updateChart(select_val, time, nowtime) {
    if (this.debounceFlag) {
      return false;
    }
    this.debounceFlag = true;
    this.ChartLabels = [];
    this.ChartData = [];
    setTimeout(() => {
      this.debounceFlag = false;
    }, 1000);
    return this.http.get(`https://back.paysxdr.com/ratesHistory?start=${time}&finish=${nowtime}&base=${select_val}&currency=XDR`).subscribe((data: [Data]) => {
      data.map(item => {
        this.ChartLabels.push(item.date);
        let reductionValue;
        if (item.val.toString().length > 7) {
          reductionValue = item.val;
          reductionValue = reductionValue.toFixed(5);
        } else {
          reductionValue = item.val;
        }
        this.ChartData.push(reductionValue);
      });
    });
  }

  openModal(event, item, modalName) {
    event.stopPropagation();
    this.currentToken = item;
    if (item.balance === '0' && modalName === 'withdraw' ||
      this.currentToken.deposit === 'disable' && modalName === 'deposit' ||
      this.currentToken.withdraw === 'disable' && modalName === 'withdraw') {
      return false
    }
    if (modalName === 'deposit') {
      if (!this.currentToken.trustline) {
        this.txId = 'AAAAAOUBi3uFavXM6Sz9MRMbdDFqfvetJDhsdGO5DdNpB3gvAAAAZAAEnRcAAAABAAAAAAAAAAAA' +
          'AAABAAAAAAAAAAYAAAABQlRDAAAAAADlAYt7hWr1zOks/TETG3Qxan73rSQ4bHRjuQ3TaQd4L3//////////AAAAAAAAAAA=';
        this.modalService.open('prepare-transaction');
        return false;
      }
      this.modalService.open(modalName);
      if (item.address === 'native') {
        this.address = this.account;
        return false;
      }
      this.getToken(item.code, item.baseUrl);
    }
    if (modalName === 'withdraw') {
      this.modalService.open(modalName);
      this.withdrawForm.reset();
      if (this.currentToken.trustline) {
        this.buttonText = 'Submit';
      } else {
        this.buttonText = 'Prepare transaction';
      }
      if (item.code === 'XLM') {
        this.withdrawToken = {
          'fee_percent': 0,
          'fee_fixed': 0,
          'min_amount': 0
        };
        this.withdrawForm.controls['amount'].setValidators([Validators.required, Validators.max(+this.currentToken.balance), Validators.min(+this.withdrawToken.min_amount), Validators.pattern(this.regexpAmount)]);
        return false
      }

      this.http.get(`https://api.apay.io/api/info`).subscribe((data) => {
        this.withdrawToken = {
          'fee_percent': data['withdraw'][item.code]['fee_percent'],
          'fee_fixed': data['withdraw'][item.code]['fee_fixed'],
          'min_amount': data['withdraw'][item.code]['min_amount']
        };
        this.withdrawForm.controls['amount'].setValidators([Validators.required, Validators.max(+this.currentToken.balance), Validators.min(+this.withdrawToken.min_amount), Validators.pattern(this.regexpAmount)]);
      });
    }
  }

  get _amount() {
    if (!this.withdrawForm.get('amount')) {
      return 0;
    }
    return this.withdrawForm.get('amount')
  }

  sendWithdrawForm() {
    this.txId = 'AAAAAOUBi3uFavXM6Sz9MRMbdDFqfvetJDhsdGO5DdNpB3gvAAAAZAAEnRcAAAABAAAAAAAAAAAA' +
      'AAABAAAAAAAAAAYAAAABQlRDAAAAAADlAYt7hWr1zOks/TETG3Qxan73rSQ4bHRjuQ3TaQd4L3//////////AAAAAAAAAAA=';
    if (this.currentToken.trustline) {
      this.isLoading = true;
      this.withdrawForm.disable();
      this.buttonText = 'Processing';
      setTimeout(() => {
        this.withdrawForm.enable();
        this.isLoading = false;
        this.modalService.close('withdraw');
        this.notify.update('Transaction completed successfully!', 'success');
      }, 3000);
    } else {
      this.modalService.close('withdraw');
      this.modalService.open('prepare-transaction');
    }
  }

  isHideLowBalanceCheckbox(event) {
    if (event.checked) {
      this.hideLowBalanceFlag = true;
      return false;
    }
    this.hideLowBalanceFlag = false;
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
    return this.http.get(baseUrl+ `/deposit?account=` + this.account + `&asset_code=` + code).subscribe((data) => {
      this.address = data['how'];
      if (this.address.indexOf('address') !== -1) {
        this.address = this.address.split('address: ')[1];
      }
    });
  }
}
