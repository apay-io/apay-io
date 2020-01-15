import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {accountData} from '../../../assets/accountData';
import {Color} from 'ng2-charts';
import * as moment from 'moment';
import {ModalService} from "../../services/modal/modal.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StellarService} from '../../services/stellar/stellar.service';

export interface Data {
  date: string;
  val: string;
}

@Component({
  selector: 'app-convert-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})

export class AccountPageComponent implements OnInit {
  dataWallet = accountData;
  rates;
  percent;
  sumValue = 0;
  sumChange = 0;
  hideLowBalanceFlag;
  searchValue;
  arraySearchValue;
  address;
  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';

  public ChartLabels = [];
  public ChartData = [];
  public debounceFlag = false;
  public ChartType = 'line';
  private account: string;
  public activeElem = 0;
  public testDataModal = [
    {
      name: 'BCH',
      min: '0.00200000',
      fee: '0.001',
      balance: '0.0031990'
    },
    {
      name: 'BEP2',
      min: '0.20000000',
      fee: '0.002',
      balance: '12.2031990'
    }
  ];

  withdrawForm: FormGroup;
  regexpAmount = /^[0-9]*[.,]?[0-9]+$/;

  constructor(private readonly http: HttpClient,
              public readonly appComponent: AppComponent,
              private readonly stellarService: StellarService,
              public modalService: ModalService) {
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
    this.http.get(`https://rates.apay.io`).subscribe((data: [Data]) => {
      this.rates = data;
    });

    // test address
    this.address = '1GJSDJFHJKfhjsdSDKFH3FDSFJ349GGDSfg8DSFk';

    this.arraySearchValue = this.dataWallet;
    this.account = localStorage.getItem('account');
    if (this.account) {
      this.stellarService.balances(this.account)
        .then((result) => {
          result.map(item => {
            const findToken = this.dataWallet.find(x => x.code === item.code);
            findToken.balance = item.amount;
            // findToken.value = +item.amount * this.rates[item.code]

            //test rates = 50
            findToken.value = +item.amount * 50;
            this.sumValue += findToken.value;

            const generateRandomColor = `rgba(${this.randomNumber()}, ${this.randomNumber()}, ${this.randomNumber()}, 1)`;
            this.datasets[0].backgroundColor.push(generateRandomColor);
          });
          this.percent = 100 / this.sumValue;

          this.drawingChart('AED', 30, 'days');
          this.dataWallet.map((item) => {
            if (item.balance === '0') {
              return false
            }
            item.percent = (this.percent * item.value).toFixed(2)
            this.doughnutChartData.push(item.percent);
            this.doughnutChartLabels.push(item.code);
            this.sumChange += +item.change;
          });
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

  openModal(event, balance, modalName) {
    event.stopPropagation();
    if (balance === '0' && modalName === 'withdraw') {
      return false
    }
    this.modalService.open(modalName);
    this.withdrawForm.controls['amount'].setValidators([Validators.required, Validators.max(+this.testDataModal[this.activeElem].balance), Validators.min(+this.testDataModal[this.activeElem].min), Validators.pattern(this.regexpAmount)]);
  }

  changeNetwork(index, min, balance) {
    this.activeElem = index;
    this.withdrawForm.controls['amount'].setValidators([Validators.required, Validators.max(balance), Validators.min(min), Validators.pattern(this.regexpAmount)]);
    this.withdrawForm.reset();
  }

  get _amount() {
    return this.withdrawForm.get('amount')
  }

  sendWithdrawForm() {
    //submit form deposit
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

  randomNumber() {
    return Math.ceil(Math.random() * 255);
  }

  addFullBalance(balance) {
    this.withdrawForm.controls['amount'].setValue(balance);
  }
}
