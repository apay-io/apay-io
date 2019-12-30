import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {testData} from '../../../assets/testData';
import {Color} from 'ng2-charts';
import * as moment from 'moment';
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
  dataWallet = testData;
  sumValue = 0;
  sumChange = 0;
  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';

  public ChartLabels = [];
  public ChartData = [];
  public debounceFlag = false;
  public ChartType = 'line';
  private account: string;

  constructor(
    private readonly http: HttpClient,
    public readonly appComponent: AppComponent,
    private readonly stellarService: StellarService,
  ) {}

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
          display: false ,
          color: '#FFFFFF'
        },
      }],
      yAxes: [{
        ticks: {
          fontColor: '#a5a5a5',
          maxTicksLimit: 5,
        },
        gridLines: {
          display: false ,
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
    this.account = localStorage.getItem('account');
    if (this.account) {
      this.stellarService.balances(this.account)
        .then(console.log);
    }
    this.drawingChart('AED', 30, 'days');
    this.dataWallet.map((item) => {
      this.doughnutChartData.push(item.percent);
      this.doughnutChartLabels.push(item.code);
      console.log(item.value, item.change);
      this.sumValue += +item.value;
      this.sumChange += +item.change;
    });
  }

  async drawingChart(select_val, time_amount, time_type) {
      const nowtime = moment().format('YYYY-MM-DD');
      const time = moment().subtract(time_amount,  time_type).format('YYYY-MM-DD');
      await this.updateChart(select_val, time, nowtime);
  }

  async updateChart (select_val, time, nowtime) {
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
}
