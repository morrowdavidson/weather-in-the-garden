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

      this.weatherOptions = this.createWeatherOptions(weatherInfoArray);
      this.rainOptions = this.createRainOptions(weatherInfoArray);
    });
  }

  createWeatherOptions(weatherInfoArray: WeatherInfo[]) {
    let dateData = [];
    let precipitationData = [];
    let mintempData = [];
    let maxtempData = [];

    for (let info of weatherInfoArray) {
      dateData.push(info.date);
      precipitationData.push(info.dailyPrecipitation);
      mintempData.push(info.mintemp);
      maxtempData.push(info.maxtemp);
    }

    return {
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
            show: false,
          },
          splitLine: {
            show: false,
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
