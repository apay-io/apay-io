import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {testData} from "../../../assets/testData";
import {Color} from "ng2-charts";
import * as moment from 'moment';

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
  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';

  constructor(
    private readonly http: HttpClient,
    public readonly appComponent: AppComponent,
  ) {}

  public ChartLabels = [];
  public ChartData = [];
  public ChartType = 'line';
  lineChartColors: Color[] = [
    {
      borderColor: '#0f59d1',
      backgroundColor: '#0f59d11f',
    },
  ];

  public doughnutChartOptions: any = {

    legend: {
      display: false,
    },
    responsive: true
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
          fontColor: "#000",
          fixedSize: 3,
        },
        type: "time",
        time: {
          // unit: "month"
          tooltipFormat: "ll"
        }
      }],
      yAxes: [{
        ticks: {
          fontColor: "#000",
          fixedSize: 1,
        }
      }]
    },
    tooltips: {
      position: "nearest",
      mode: "index",
      intersect: false,
    },
  };

  ngOnInit() {
    this.drawingChart('AED', 30,"days")
    this.dataWallet.map((item) => {
      this.doughnutChartData.push(item.value);
      this.doughnutChartLabels.push(item.code);
    });
  }

  async drawingChart(select_val, time_amount,time_type) {
      const nowtime = moment().format("YYYY-MM-DD");
      const time = moment().subtract(time_amount,  time_type).format("YYYY-MM-DD");
      await this.updateChart(select_val, time, nowtime);
  }

  async updateChart (select_val, time, nowtime) {
    this.ChartLabels = [];
    this.ChartData = [];
    return this.http.get(`https://back.paysxdr.com/ratesHistory?start=${time}&finish=${nowtime}&base=${select_val}&currency=XDR`).subscribe((data: [Data]) => {
      data.map(item => {
        this.ChartLabels.push(item.date);
        this.ChartData.push(item.val);
      })
    });
  }
}
