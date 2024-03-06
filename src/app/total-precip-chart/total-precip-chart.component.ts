import { Component, OnInit } from '@angular/core';
import { WeatherDataService } from '../services/weather-data.service';

interface WeatherInfo {
  dailyPrecipitation: number;
  mintemp?: number;
  maxtemp?: number;
  date: string;
}

@Component({
  selector: 'app-total-precip-chart',
  templateUrl: './total-precip-chart.component.html',
  styleUrls: ['./total-precip-chart.component.scss'],
})
export class TotalPrecipChartComponent {
  public weatherInfo: Record<string, WeatherInfo> = {};
  public weatherOptions: any;
  public weatherInfoArray: any = [];
  public rainOptions: any;
  public searchClicked: boolean = false;
  public totalPrecipitation: number = 0;

  constructor(private weatherDataService: WeatherDataService) {}

  ngOnInit() {
    this.weatherDataService.triggerAdvancedViewUpdate$.subscribe(() => {
      this.searchClicked = this.weatherDataService.searchClicked;

      const weatherInfo = this.weatherDataService.getWeatherInfo();
      const weatherInfoArray = Object.values(
        weatherInfo.days
      ).reverse() as WeatherInfo[];
      this.totalPrecipitation =
        weatherInfo.totalPrecipitation.totalPrecipitation.toFixed(2);

      // this.weatherOptions = this.createWeatherOptions(weatherInfoArray);
      this.rainOptions = this.createRainOptions(weatherInfoArray);
    });
  }

  createRainOptions(weatherInfoArray: WeatherInfo[]) {
    let seriesData = [];

    for (let i = 0; i < weatherInfoArray.length; i++) {
      let w = weatherInfoArray[i];
      let dataItem = {
        name: `${7 - i} Days ago: ${w.date.substring(5)}`,
        type: 'bar',
        stack: 'total',
        data: [w.dailyPrecipitation],
        itemStyle: {
          borderRadius: 20,
        },
        label: {
          show: w.dailyPrecipitation !== 0,
          position: 'inside',
        },
      };
      seriesData.push(dataItem);
    }

    return {
      title: {},
      tooltip: {},
      legend: {
        show: false,
        bottom: 0,
      },
      xAxis: {
        data: ['Precipitation'],
      },
      yAxis: {
        min: 0,
        max: Math.max(this.totalPrecipitation, 1),
      },
      series: seriesData,
    };
  }
}
