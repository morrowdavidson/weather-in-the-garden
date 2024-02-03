import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WsService } from '../ws.service';

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
  public totalPrecipitation: number = 0;
  public weatherStats: Record<string, WeatherStat> = {};
  public weatherOptions: any;

  constructor(private formBuilder: FormBuilder, private wsService: WsService) {}

  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  sendToWS(formValues: FormValues) {
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
    this.wsService.getForecast(formValues.location).subscribe((data) => {
      console.log(data);
    });
  }

  setOptions() {
    const weatherStatsArray = Object.values(this.weatherStats);

    this.weatherOptions = {
      title: {
        text: 'Weather Status Chart',
      },
      legend: {
        data: ['Precipitation', 'Min Temp', 'Max Temp'],
      },
      tooltip: {
        order: 'valueDesc',
        trigger: 'axis',
      },
      xAxis: {
        data: weatherStatsArray.map((w) => w.date.toLocaleDateString()),
      },
      yAxis: [
        {
          type: 'value',
          name: 'Temperature',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value} °F',
          },
        },
        {
          type: 'value',
          name: 'Precipitation',
          position: 'right',
          min: 0,
          max: 2,
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value} "',
          },
        },
      ],
      series: [
        {
          name: 'Precipitation',
          type: 'bar',
          data: weatherStatsArray.map((w) => w.precipitation),
          yAxisIndex: 1,
        },
        {
          name: 'Min Temp',
          type: 'line',
          data: weatherStatsArray.map((w) => w.mintemp),
        },
        {
          name: 'Max Temp',
          type: 'line',
          data: weatherStatsArray.map((w) => w.maxtemp),
        },
      ],
    };
  }
}
