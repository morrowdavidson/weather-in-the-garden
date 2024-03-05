import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherDataService {
  private weatherInfo: any;
  public searchClicked = false;
  private triggerAdvancedViewUpdate = new Subject<void>();

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
}
