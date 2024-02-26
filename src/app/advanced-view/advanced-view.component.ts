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
  public rainOptions: any;

  constructor(private weatherDataService: WeatherDataService) {}

  setOptions() {
    const weatherInfo = this.weatherDataService.getWeatherInfo();
    const weatherInfoArray = Object.values(weatherInfo.days).reverse();
    console.log('weatherInfoArray', weatherInfoArray);
    let dateData = [];
    let precipitationData = [];
    let mintempData = [];
    let maxtempData = [];

    console.log(weatherInfo.totalPrecipitation.totalPrecipitation);

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

    let seriesData = [];
    for (let i = 0; i < weatherInfoArray.length; i++) {
      let w = weatherInfoArray[i] as WeatherInfo;
      let dataItem = {
        name: `${7 - i} Days ago: ${w.date.substring(5)}`, //calculate number of days ago and strip off the year
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

    this.rainOptions = {
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
        max: Math.max(weatherInfo.totalPrecipitation.totalPrecipitation, 1), //if precipitation is less then 1, set the max to 1
      },
      series: seriesData,
    };
  }
}
