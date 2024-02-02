import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WsService } from '../ws.service';

interface FormValues {
  location: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent {
  public weatherSearchForm!: FormGroup;
  public weatherData: any;
  public totalPrecipitation: number = 0;

  constructor(private formBuilder: FormBuilder, private wsService: WsService) {}

  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  sendToWS(formValues: FormValues) {
    interface WeatherStat {
      precipitation: number;
      mintemp: number;
      maxtemp: number;
      date: Date;
    }

    let weatherStats: Record<string, WeatherStat> = {};

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
        weatherStats[day] = {
          precipitation: precipitation,
          mintemp: mintemp,
          maxtemp: maxtemp,
          date: date,
        };
      }
    });
    console.log(weatherStats);
  }
}
