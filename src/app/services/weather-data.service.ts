import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherDataService {
  private weatherInfo: any;

  constructor() {}

  setWeatherInfo(stats: any) {
    this.weatherInfo = stats;
  }

  getWeatherInfo() {
    return this.weatherInfo;
  }
}
