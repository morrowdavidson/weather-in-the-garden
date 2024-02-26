import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { WeatherDataService } from '../services/weather-data.service';
import { AdvancedViewComponent } from '../advanced-view/advanced-view.component';

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
    private weatherDataService: WeatherDataService,
    private advancedViewComponent: AdvancedViewComponent
  ) {}

  ngOnInit() {
    this.advancedSearchForm = this.formBuilder.group({
      location: [''],
      interval: ['24'],
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
        this.advancedViewComponent.setOptions();

        console.log('weatherData', this.weatherData);
      });
  }

  processWeatherData() {
    const { name, region, country } = this.weatherData.location; // Destructure the location object
    this.locationData = { name, region, country }; // Assign the location data to the locationData object

    const dateArray = Object.keys(this.weatherData.historical);
    console.log('dateArray', dateArray);

    let totalPrecipitation = 0;
    let dailyPrecipitation = 0;

    for (let i = 0; i < dateArray.length; i++) {
      const day = 'day(' + (-i - 1) + ')'; // Create an internal string for the day... day(-1) = yesterday; day(-2) = 2 days ago
      const { hourly, mintemp, maxtemp } =
        this.weatherData.historical[dateArray[i]]; // Destructure the hourly, mintemp, and maxtemp properties from the historical object
      dailyPrecipitation = 0; // Reset daily precipitation for each day
      for (
        let j = 0;
        j < this.weatherData.historical[dateArray[i]].hourly.length;
        j++
      ) {
        dailyPrecipitation +=
          this.weatherData.historical[dateArray[i]].hourly[j].precip;
      }
      // Now dailyPrecipitation contains the total precipitation for the day

      console.log(
        `Total precipitation for ${dateArray[i]}: ${dailyPrecipitation}`
      );

      const date = dateArray[i];

      totalPrecipitation += dailyPrecipitation;
      // Create a new property in weatherInfo for the day and assign it the precipitation and temperature
      this.weatherInfo['days'][day] = {
        dailyPrecipitation,
        mintemp,
        maxtemp,
        date,
      };
    }

    this.weatherInfo['totalPrecipitation'] = {
      totalPrecipitation,
    };

    this.weatherDataService.setWeatherInfo(this.weatherInfo);
    console.log('weatherInfo', this.weatherInfo);
  }
}
