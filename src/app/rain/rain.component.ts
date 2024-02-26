import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';

import { format } from 'echarts';

interface FormValues {
  location: string;
}

interface WeatherStat {
  precipitation: number;
  mintemp?: number;
  maxtemp?: number;
  date: string;
}

@Component({
  selector: 'app-rain',
  templateUrl: './rain.component.html',
  styleUrls: ['./rain.component.scss'],
})
export class RainComponent implements OnInit {
  public weatherSearchForm!: FormGroup;
  public weatherData: any;
  public forecastData: any;
  public totalPrecipitation: number = 0;
  public weatherStats: Record<string, WeatherStat> = {};
  public precipitationForecast: Record<string, WeatherStat> = {};
  public locationData: any = {};
  public weatherOptions: any;
  public searchClicked: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  submitSearch(formValues: FormValues) {
    this.searchClicked = true;
    // Get the historical weather data
    this.apiService
      .getHistorical(formValues.location, '24')
      .subscribe((data) => {
        this.weatherData = data;
        this.processWeatherData();
        this.setOptions();

        console.log('weatherData', this.weatherData);
      });
  }

  processWeatherData() {
    const { name, region, country } = this.weatherData.location;
    this.locationData = { name, region, country };

    const dateArray = Object.keys(this.weatherData.historical);
    console.log('dateArray', dateArray);

    this.totalPrecipitation = 0;

    for (let i = 0; i < dateArray.length; i++) {
      const day = 'day(' + (-i - 1) + ')'; // Create an internal string for the day... day(-1) = yesterday; day(-2) = 2 days ago
      const { hourly, mintemp, maxtemp } =
        this.weatherData.historical[dateArray[i]];
      const precipitation = hourly[0].precip;
      const date = dateArray[i];

      this.totalPrecipitation += precipitation;
      // Create a new property in weatherStats for the day and assign it the precipitation and temperature
      this.weatherStats[day] = {
        precipitation,
        mintemp,
        maxtemp,
        date,
      };
    }
    console.log('weatherStats', this.weatherStats);
  }

  setOptions() {
    const weatherStatsArray = Object.values(this.weatherStats).reverse();
    const colors = [
      '#BAD0D9',
      '#8BB4C5',
      '#5C94AB',
      '#3F809A',
      '#2A708D',
      '#1E647F',
      '#0D546F',
    ];

    this.weatherOptions = {
      title: {},
      tooltip: {},
      legend: {
        show: true,
        bottom: 0,
      },
      xAxis: {
        data: ['Precipitation'],
      },
      yAxis: {
        min: 0,
        max: Math.max(this.totalPrecipitation, 1), //if precipitation is less then 1, set the max to 1
      },
      series: weatherStatsArray
        .map((w, i) => ({
          name: `${7 - i} Days ago: ${w.date.substring(5)}`, //calculate number of days ago and strip off the year
          type: 'bar',
          stack: 'total',
          data: [w.precipitation],
          itemStyle: {
            color: colors[i],
            borderRadius: 20,
          },
          label: {
            show: w.precipitation !== 0,
            position: 'inside',
          },
        }))
        .filter((s) => s.data[0] > 0),
    };
  }
}
