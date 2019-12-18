import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {testData} from "../../../assets/testData";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-convert-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})

export class AccountPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;
  dataWallet = testData;

  constructor(
    private readonly http: HttpClient,
    public readonly appComponent: AppComponent,
    private zone: NgZone
  ) {}

  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';
  public doughnutChartOptions: any = {
    legend: {
      display: false,
    },
    responsive: true
  };

  ngOnInit() {
    this.dataWallet.map((item) => {
      this.doughnutChartData.push(item.value);
      this.doughnutChartLabels.push(item.code);
    })
  }

  ngAfterViewInit() {
    this.drawingChart();
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  drawingChart() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chart", am4charts.XYChart);

      chart.paddingRight = 20;

      let data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2019, 0, i), name: "name" + i, value: visits });
      }

      chart.data = data;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";

      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    });
  }
}
