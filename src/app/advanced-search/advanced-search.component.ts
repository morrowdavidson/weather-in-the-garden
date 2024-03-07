import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { WeatherDataService } from '../services/weather-data.service';
import { Observable } from 'rxjs'; // Add this line
interface FormValues {
  location: string;
  interval: string;
}

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  public advancedSearchForm!: FormGroup;
  public weatherData: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private weatherDataService: WeatherDataService
  ) {}

  ngOnInit() {
    this.advancedSearchForm = this.formBuilder.group({
      location: ['london'],
      interval: ['24'],
    });
    this.submitSearch(this.advancedSearchForm.value);
  }

  submitSearch(formValues: FormValues) {
    this.weatherDataService.setSearchClicked(true);
    // Get the historical weather data
    this.apiService
      .getHistorical(formValues.location, '24')
      .subscribe((data: any) => {
        this.weatherData = data;
        this.weatherDataService.processWeatherData(data);
        this.weatherDataService.triggerUpdate();

        console.log('weatherData', this.weatherData);
      });
  }
}
