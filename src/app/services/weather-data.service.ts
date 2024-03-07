import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class WeatherDataService {
  public weatherInfo: Record<any, WeatherInfoWithTotal> = { days: {} };
  public searchClicked = false;
  private triggerAdvancedViewUpdate = new Subject<void>();
  public weatherData: any;
  public locationData: any = {};

  constructor() {}

  setWeatherInfo(stats: any) {
    this.weatherInfo = stats;
  }

  getWeatherInfo() {
    return this.weatherInfo;
  }

  // Expose the trigger as an Observable
  triggerAdvancedViewUpdate$ = this.triggerAdvancedViewUpdate.asObservable();

  // Method to trigger the update
  triggerUpdate() {
    this.triggerAdvancedViewUpdate.next();
  }

  setSearchClicked(value: boolean) {
    this.searchClicked = value;
    console.log('searchClicked', this.searchClicked);
  }

  getSearchClicked() {
    console.log('searchClicked should be true', this.searchClicked);

    return this.searchClicked;
  }

  processWeatherData(data: any) {
    console.log('data', data);
    this.weatherData = data;
    this.setLocationData();
    const dateArray = Object.keys(this.weatherData.historical);
    this.processHistoricalData(dateArray);
    this.setWeatherInfo(this.weatherInfo);
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
