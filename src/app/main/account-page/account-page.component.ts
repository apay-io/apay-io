import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {results} from "../../../assets/test";
import {Color} from "ng2-charts";
import {BorderWidth} from "chart.js";

export interface Data {
  month: String;
  price: Number;
}

@Component({
  selector: 'app-convert-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})

export class AccountPageComponent implements OnInit {

  constructor(
    private readonly http: HttpClient,
    public readonly appComponent: AppComponent,
  ) {}

  public doughnutChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public doughnutChartData = [120, 150, 180, 90];
  public doughnutChartType = 'doughnut';


  // public ChartLabels = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December'
  // ];
  public ChartLabels = [
    "March 12, 2018"
    ,"March 13, 2018	"
    ,"March 14, 2018	"
    ," March 15, 2018"
    ," March 16, 2018"
    ," March 17, 2018"
    ," March 18, 2018"
    ," March 19, 2018"
    ," March 20, 2018"
    ," March 21, 2018"
    ," March 22, 2018"
    ," March 23, 2018"
    ," March 24, 2018"
    ," March 25, 2018"
    ," March 26, 2018"
    ," March 27, 2018"
    ," March 28, 2018"
    ," March 29, 2018"
    ," March 30, 2018"
    ," March 31, 2018"
    ," April 01, 2018"
    ," April 02, 2018"
    ," April 03, 2018"
    ," April 04, 2018"
    ," April 05, 2018"
    ," April 06, 2018"
    ," April 07, 2018"
    ," April 08, 2018"
    ," April 09, 2018"
    ," April 10, 2018"
    ," April 11, 2018"
    ," April 12, 2018"
    ," April 13, 2018"
    ," April 14, 2018"
    ," April 15, 2018"
    ," April 16, 2018"
    ," April 17, 2018"
    ," April 18, 2018"
    ," April 19, 2018"
    ," April 20, 2018"
    ," April 21, 2018"
    ," April 22, 2018"
    ," April 23, 2018"
    ," April 24, 2018"
    ," April 25, 2018"
    ," April 26, 2018"
    ," April 27, 2018"
    ," April 28, 2018"
    ," April 29, 2018"
    ," April 30, 2018"
    ," May 01, 2018"
    ," May 02, 2018"
    ," May 03, 2018"
    ," May 04, 2018"
    ," May 05, 2018"
    ," May 06, 2018"
    ," May 07, 2018"
    ," May 08, 2018"
    ," May 09, 2018"
    ," May 11, 2018"
    ," May 12, 2018"
    ," May 13, 2018"
    ," May 14, 2018"
    ," May 15, 2018"
    ," May 16, 2018"
    ," May 17, 2018"
    ," May 18, 2018"
    ," May 19, 2018"
    ," May 20, 2018"
    ," May 21, 2018"
    ," May 22, 2018"
    ," May 23, 2018"
    ," May 24, 2018"
    ," May 25, 2018"
    ," May 26, 2018"
    ," May 27, 2018"
    ," May 28, 2018"
    ," May 29, 2018"
    ," May 30, 2018"
    ," May 31, 2018"
    ," June 01, 2018"
    ," June 02, 2018"
    ," June 03, 2018"
    ," June 04, 2018"
    ," June 05, 2018"
    ," June 06, 2018"
    ," June 07, 2018"
    ," June 08, 2018"
    ," June 09, 2018"
    ," June 10, 2018"
    ," June 11, 2018"
    ," June 12, 2018"
  ];
  public ChartData = [
    3418
    ,2673
    ,49
    ,2303
    ,1204
    ,3009
    ,4114
    ,3041
    ,2370
    ,2136
    ,1039
    ,2030
    ,2729
    ,3759
    ,2584
    ,2060
    ,2071
    ,2039
    ,1990
    ,2418
    ,805
    ,123
    ,1781
    ,1776
    ,2000
    ,2122
    ,2091
    ,3402
    ,2274
    ,1768
    ,1441
    ,1850
    ,1776
    ,1994
    ,2978
    ,2109
    ,1320
    ,1804
    ,1842
    ,1664
    ,2043
    ,2827
    ,2000
    ,1652
    ,1709
    ,1309
    ,1746
    ,1628
    ,2645
    ,2010
    ,1492
    ,1556
    ,1617
    ,1499
    ,1665
    ,2073
    ,1857
    ,1503
    ,1524
    ,1490
    ,1373
    ,1998
    ,2596
    ,1750
    ,1486
    ,1317
    ,1435
    ,1538
    ,1883
    ,1766
    ,1546
    ,1303
    ,1294
    ,1313
    ,1366
    ,1081
    ,1351
    ,1191
    ,1482
    ,874
    ,894
    ,1296
    ,1569
    ,2098
    ,1643
    ,1331
    ,1375
    ,1393
    ,1384
    ,1514
    ,2075
    ,1567
    ,1387
  ];
  public ChartType = 'line';
  lineChartColors: Color[] = [
    {
      borderColor: '#0f59d1',
      backgroundColor: '#0f59d11f',
    },
  ];
  // lineChartBorderWidth: BorderWidth[] = [
  //   {
  //     borderWidth: 2
  //   },
  // ];
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
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'month'
        }
      }]
    },
    scaleShowVerticalLines: false,
    responsive: true
  };

  ngOnInit() {
  }

  updateChart() {

  }
}
