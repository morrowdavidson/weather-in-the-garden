import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { WeatherDataService } from '../weather-data-service.service';

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
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  public advancedSearchForm!: FormGroup;
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
    private apiService: ApiService,
    private weatherDataService: WeatherDataService
  ) {}

  ngOnInit() {
    this.advancedSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  submitSearch(formValues: FormValues) {
    this.searchClicked = true;
    //Get the historical weather data
    this.apiService
      .getHistorical(formValues.location, '24')
      .subscribe((data) => {
        this.weatherData = data;
        console.log(this.weatherData);

        this.locationData.name = this.weatherData.location.name;
        this.locationData.region = this.weatherData.location.region;
        this.locationData.country = this.weatherData.location.country;

        console.log(this.locationData);

        this.calculateWeatherStats(this.weatherData.historical);
        console.log(this.weatherStats);
      });
  }

  calculateWeatherStats(historicalData: any): void {
    const dateArray = Object.keys(historicalData);

    this.totalPrecipitation = 0;

    for (let i = 0; i < dateArray.length; i++) {
      let day = 'day' + (-i - 1); // Create a string for the day
      let precipitation = historicalData[dateArray[i]].hourly[0].precip;
      let mintemp = historicalData[dateArray[i]].mintemp;
      let maxtemp = historicalData[dateArray[i]].maxtemp;
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
  }
}
