import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {testData} from "../../../assets/testData";
import {Color} from "ng2-charts";
import * as moment from 'moment';
import {ModalService} from "../../services/modal/modal.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
  dataWallet = testData;
  sumValue = 0;
  sumChange = 0;
  hideLowBalanceFlag;
  searchValue;
  arraySearchValue;
  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';

  public ChartLabels = [];
  public ChartData = [];
  public debounceFlag = false;
  public ChartType = 'line';
  public activeElem = 0;
  public testDataDepositModal = [
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

  depositForm: FormGroup;

  constructor(
    private readonly http: HttpClient,
    public readonly appComponent: AppComponent,
    public modalService: ModalService
  ) {
    this.depositForm = new FormGroup({
      recipient: new FormControl('', [
        Validators.required,
      ]),
      amount: new FormControl('', [
        Validators.required,
      ])
    });
  }

  barChartColors: Color[] = [
    {
      borderColor: '#0f59d1',
      backgroundColor: '#0f59d11f',
    },
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
    },

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
          fontColor: "#a5a5a5",
          maxTicksLimit: 6,
          maxRotation: 0,
        },
        type: "time",
        time: {
          // unit: "month"
          tooltipFormat: "ll",
        },
        gridLines: {
          display: false ,
          color: "#FFFFFF"
        },
      }],
      yAxes: [{
        ticks: {
          fontColor: "#a5a5a5",
          maxTicksLimit: 5,
        },
        gridLines: {
          display: false ,
          color: "#FFFFFF"
        },
      }]
    },
    tooltips: {
      position: "nearest",
      mode: "index",
      intersect: false,
    },
  };

  ngOnInit() {
    this.arraySearchValue = this.dataWallet
    this.drawingChart('AED', 30,"days")
    this.dataWallet.map((item) => {
      if (item.balance === 0) {
        return false
      }
      this.doughnutChartData.push(item.percent);
      this.doughnutChartLabels.push(item.code);
      this.sumValue += +item.value;
      this.sumChange += +item.change;
    });
  }

  async drawingChart(select_val, time_amount,time_type) {
      const nowtime = moment().format("YYYY-MM-DD");
      const time = moment().subtract(time_amount,  time_type).format("YYYY-MM-DD");
      await this.updateChart(select_val, time, nowtime);
  }

  async updateChart (select_val, time, nowtime) {
    if (this.debounceFlag) {
      return false
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
          reductionValue = item.val
        }
        this.ChartData.push(reductionValue);
      })
    });
  }

  openModal (event, modalName) {
    event.stopPropagation();
    this.modalService.open(modalName);
    this.depositForm.controls['amount'].setValidators([Validators.required, Validators.max(+this.testDataDepositModal[0].balance), Validators.min(+this.testDataDepositModal[0].min)]);
  }

  changeNetwork(index, min, balance) {
    this.activeElem = index;
    this.depositForm.controls['amount'].setValidators([Validators.required, Validators.max(balance), Validators.min(min)]);
    this.depositForm.reset();
  }

  sendDeposit () {
    //submit form deposit
  }

  onCheckboxChagen(event) {
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
}
