import { Component, OnInit } from '@angular/core';
import { WeatherDataService } from '../services/weather-data.service';

interface WeatherInfo {
  dailyPrecipitation: number;
  mintemp?: number;
  maxtemp?: number;
  date: string;
}

@Component({
  selector: 'app-advanced-view',
  templateUrl: './advanced-view.component.html',
  styleUrls: ['./advanced-view.component.scss'],
})
export class AdvancedViewComponent {
  public weatherInfo: Record<string, WeatherInfo> = {};
  public weatherOptions: any;
  public weatherInfoArray: any = [];

  constructor(private weatherDataService: WeatherDataService) {}

  setOptions() {
    const getWeatherInfo = this.weatherDataService.getWeatherInfo();
    const weatherInfoArray = Object.values(getWeatherInfo).reverse();
    console.log('weatherInfoArray', weatherInfoArray);
    let dateData = [];
    let precipitationData = [];
    let mintempData = [];
    let maxtempData = [];

    for (let info of weatherInfoArray as WeatherInfo[]) {
      dateData.push(info.date);
      precipitationData.push(info.dailyPrecipitation);
      mintempData.push(info.mintemp);
      maxtempData.push(info.maxtemp);
    }

    this.weatherOptions = {
      title: {},
      tooltip: {},
      legend: {
        show: true,
        bottom: 0,
      },
      xAxis: {
        data: dateData,
      },
      yAxis: [
        {
          type: 'value',
          name: 'Temperature',
          min: 0,
          max: 100,

          position: 'left',
        },
        {
          type: 'value',
          name: 'Percipitation',
          min: 0,
          max: 4,
          position: 'right',
          axisLine: {
            show: false, // This hides the y-axis line
          },
          splitLine: {
            show: false, // This hides the x-axis lines on the y-axis
          },
        },
      ],
      series: [
        {
          name: 'Precipitation',
          type: 'bar',
          data: precipitationData,
          yAxisIndex: 1,
        },
        {
          name: 'Min Temp',
          type: 'line',
          data: mintempData,
          yAxisIndex: 0,
        },
        {
          name: 'Max Temp',
          type: 'line',
          data: maxtempData,
          yAxisIndex: 0,
        },
      ],
    };
  }
}
