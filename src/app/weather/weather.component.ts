import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WsService } from '../ws.service';
import { format } from 'echarts';

interface FormValues {
  location: string;
}

interface WeatherStat {
  precipitation: number;
  mintemp: number;
  maxtemp: number;
  date: Date;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  public weatherSearchForm!: FormGroup;
  public weatherData: any;
  public forecastData: any;
  public totalPrecipitation: number = 0;
  public weatherStats: Record<string, WeatherStat> = {};
  public weatherOptions: any;
  public searchClicked: boolean = false;

  constructor(private formBuilder: FormBuilder, private wsService: WsService) {}

  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  sendToWS(formValues: FormValues) {
    this.searchClicked = true;
    //Get the historical weather data
    this.wsService.getHistorical(formValues.location).subscribe((data) => {
      this.weatherData = data;

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

    //Get the forcast weather data
    // this.wsService.getForecast(formValues.location).subscribe((data: any) => {
    //   this.forecastData = data;

    //   const foreCastArray = Object.keys(this.forecastData.list);

    //   for (let i = 0; i < foreCastArray.length; i++) {
    //     let timestamp = this.forecastData.list[i].dt;
    //     let longDate = new Date(timestamp * 1000); // Create a new Date object

    //     let day = String(longDate.getDate()).padStart(2, '0');
    //     let month = String(longDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    //     let year = longDate.getFullYear();

    //     let hours = String(longDate.getHours()).padStart(2, '0');
    //     let minutes = String(longDate.getMinutes()).padStart(2, '0');

    //     let formattedDate = `${month}/${day}/${year}`;

    //     let precipitation = this.forecastData.list[i].main.rain || 0;
    //     let mintemp = this.forecastData.list[i].main.temp_min;
    //     let maxtemp = this.forecastData.list[i].main.temp_max;

    //     console.log(hours + ':' + minutes + ' ' + formattedDate);
    //     console.log(precipitation);
    //     console.log(mintemp);
    //     console.log(maxtemp);
    //   }
    // });
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
          name: `${7 - i} Days ago: ${w.date.toLocaleDateString()}`,
          type: 'bar',
          stack: 'total',
          data: [w.precipitation],
          itemStyle: {
            color: colors[i],
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
