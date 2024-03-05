import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { WeatherDataService } from '../services/weather-data.service';

interface FormValues {
  location: string;
  interval: string;
}

interface WeatherInfo {
  [key: string]: any;
  dailyPrecipitation?: number;
  mintemp?: number;
  maxtemp?: number;
  date?: string;
}
interface WeatherInfoWithTotal extends WeatherInfo {
  totalPrecipitation?: number;
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
  public weatherInfo: Record<any, WeatherInfoWithTotal> = { days: {} };
  public precipitationForecast: Record<string, WeatherInfo> = {};
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
      interval: ['24'],
    });
  }

  submitSearch(formValues: FormValues) {
    this.weatherDataService.setSearchClicked(true);
    // Get the historical weather data
    this.apiService
      .getHistorical(formValues.location, '24')
      .subscribe((data) => {
        this.weatherData = data;
        this.processWeatherData();
        this.weatherDataService.triggerUpdate();

        console.log('weatherData', this.weatherData);
      });
  }

  processWeatherData() {
    this.setLocationData();
    const dateArray = Object.keys(this.weatherData.historical);
    this.processHistoricalData(dateArray);
    this.weatherDataService.setWeatherInfo(this.weatherInfo);
  }

  setLocationData() {
    const { name, region, country } = this.weatherData.location;
    this.locationData = { name, region, country };
  }

  processHistoricalData(dateArray: string[]) {
    let totalPrecipitation = 0;

    for (let i = 0; i < dateArray.length; i++) {
      const day = `day(${-i - 1})`;
      const { hourly, mintemp, maxtemp } =
        this.weatherData.historical[dateArray[i]];
      const dailyPrecipitation = this.calculateDailyPrecipitation(hourly);

      totalPrecipitation += dailyPrecipitation;
      this.weatherInfo['days'][day] = {
        dailyPrecipitation,
        mintemp,
        maxtemp,
        date: dateArray[i],
      };
    }

    this.weatherInfo['totalPrecipitation'] = {
      totalPrecipitation,
    };
  }

  calculateDailyPrecipitation(hourlyData: any[]): number {
    let dailyPrecipitation = 0;
    for (let j = 0; j < hourlyData.length; j++) {
      dailyPrecipitation += hourlyData[j].precip;
    }
    return dailyPrecipitation;
  }
}
