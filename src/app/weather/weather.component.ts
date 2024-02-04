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

    //   this.weatherOptions = {
    //     title: {
    //       text: 'Weather Status Chart',
    //     },
    //     legend: {
    //       data: ['Precipitation', 'Min Temp', 'Max Temp'],
    //     },
    //     tooltip: {
    //       order: 'valueDesc',
    //       trigger: 'axis',
    //     },
    //     xAxis: {
    //       data: weatherStatsArray.map((w) => w.date.toLocaleDateString()),
    //     },
    //     yAxis: [
    //       {
    //         type: 'value',
    //         name: 'Temperature',
    //         position: 'left',
    //         alignTicks: true,
    //         axisLine: {
    //           show: true,
    //         },
    //         axisLabel: {
    //           formatter: '{value} °F',
    //         },
    //       },
    //       {
    //         type: 'value',
    //         name: 'Precipitation',
    //         position: 'right',
    //         min: 0,
    //         max: 2,
    //         axisLine: {
    //           show: true,
    //         },
    //         axisLabel: {
    //           formatter: '{value} "',
    //         },
    //       },
    //     ],
    //     series: [
    //       {
    //         name: 'Precipitation',
    //         type: 'bar',
    //         data: weatherStatsArray.map((w) => w.precipitation),
    //         yAxisIndex: 1,
    //       },
    //       {
    //         name: 'Min Temp',
    //         type: 'line',
    //         data: weatherStatsArray.map((w) => w.mintemp),
    //       },
    //       {
    //         name: 'Max Temp',
    //         type: 'line',
    //         data: weatherStatsArray.map((w) => w.maxtemp),
    //       },
    //     ],
    //   };

    this.weatherOptions = {
      title: {},

      tooltip: {},
      legend: {
        show: false,
      },
      xAxis: {
        data: ['Precipitation'],
      },
      yAxis: { min: 0, max: 1 },
      series: [
        {
          name: '7 Days ago: ' + weatherStatsArray[6].date.toLocaleDateString(),
          type: 'bar',
          stack: 'total',
          data: [weatherStatsArray[6].precipitation],
          itemStyle: {
            color: '#BAD0D9',
          },
          label: {
            show: weatherStatsArray[6].precipitation !== 0,
            position: 'inside',
          },
        },
        {
          name: '6 Days ago: ' + weatherStatsArray[5].date.toLocaleDateString(),
          type: 'bar',
          stack: 'total',
          data: [weatherStatsArray[5].precipitation],
          itemStyle: {
            color: '#8BB4C5',
          },
          label: {
            show: weatherStatsArray[5].precipitation !== 0,
            position: 'inside',
          },
        },
        {
          name: '5 Days ago: ' + weatherStatsArray[4].date.toLocaleDateString(),
          type: 'bar',
          stack: 'total',
          data: [weatherStatsArray[4].precipitation],
          itemStyle: {
            color: '#5C94AB',
          },
          label: {
            show: weatherStatsArray[4].precipitation !== 0,
            position: 'inside',
          },
        },
        {
          name: '4 Days ago: ' + weatherStatsArray[3].date.toLocaleDateString(),
          type: 'bar',
          stack: 'total',
          data: [weatherStatsArray[3].precipitation],
          itemStyle: {
            color: '#3F809A',
          },
          label: {
            show: weatherStatsArray[3].precipitation !== 0,
            position: 'inside',
          },
        },
        {
          name: '3 Days ago: ' + weatherStatsArray[2].date.toLocaleDateString(),
          type: 'bar',
          stack: 'total',
          data: [weatherStatsArray[2].precipitation],
          itemStyle: {
            color: '#2A708D',
          },
          label: {
            show: weatherStatsArray[2].precipitation !== 0,
            position: 'inside',
          },
        },
        {
          name: '2 Days ago: ' + weatherStatsArray[1].date.toLocaleDateString(),
          type: 'bar',
          stack: 'total',
          data: [weatherStatsArray[1].precipitation],
          itemStyle: {
            color: '#1E647F',
          },
          label: {
            show: weatherStatsArray[1].precipitation !== 0,
            position: 'inside',
          },
        },
        {
          name: '1 Day ago: ' + weatherStatsArray[0].date.toLocaleDateString(),
          type: 'bar',
          stack: 'total',
          data: [weatherStatsArray[0].precipitation],
          itemStyle: {
            color: '#0D546F',
          },
          label: {
            show: weatherStatsArray[0].precipitation !== 0,
            position: 'inside',
          },
        },
      ],
    };
  }
}
