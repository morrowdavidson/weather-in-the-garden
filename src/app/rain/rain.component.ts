import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';

import { format } from 'echarts';

interface FormValues {
  location: string;
}

interface WeatherStat {
  precipitation: number;
  mintemp?: number;
  maxtemp?: number;
  date: Date;
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
    //Get the historical weather data
    this.apiService.getHistorical(formValues.location).subscribe((data) => {
      this.weatherData = data;
      console.log(this.weatherData);

      this.locationData.name = this.weatherData.location.name;
      this.locationData.region = this.weatherData.location.region;
      this.locationData.country = this.weatherData.location.country;

      console.log(this.locationData);

      const dateArray = Object.keys(this.weatherData.historical);

      this.totalPrecipitation = 0;

      for (let i = 0; i < dateArray.length; i++) {
        let day = 'day' + (-i - 1); // Create a string for the day
        let precipitation =
          this.weatherData.historical[dateArray[i]].hourly[0].precip;
        let mintemp = this.weatherData.historical[dateArray[i]].mintemp;
        let maxtemp = this.weatherData.historical[dateArray[i]].maxtemp;
        let date = new Date(dateArray[i]);

        this.totalPrecipitation += precipitation;
        // Create a new property in weatherStats for the day and assign it the precipitation and temperature
        this.weatherStats[day] = {
          precipitation: precipitation,
          mintemp: mintemp,
          maxtemp: maxtemp,
          date: date,
        };
      }
      this.setOptions();
    });
  }

  setOptions() {
    const weatherStatsArray = Object.values(this.weatherStats);
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
        max: 1,
      },
      series: weatherStatsArray
        .map((w, i) => ({
          name: `${7 - i} Days ago: ${w.date.toLocaleDateString(undefined, {
            month: '2-digit',
            day: '2-digit',
          })}`,
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
