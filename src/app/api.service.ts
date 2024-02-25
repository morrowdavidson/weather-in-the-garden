import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
const weatherStackAPIKey = environment.weatherStackAPIKey;
const openWeatherAPIKEY = environment.openWeatherAPIKEY;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getLastSevenDays() {
    let dates = '';
    for (let i = 1; i < 8; i++) {
      let d = new Date();
      d.setDate(d.getDate() - i);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      dates += year + '-' + month + '-' + day;
      if (i < 7)
        // Don't add a semicolon after the last date
        dates += ';';
    }
    console.log(dates);
    return dates;
  }

  getHistorical(location: string, interval: string) {
    const dates = this.getLastSevenDays();

    return this.http.get(
      'https://api.weatherstack.com/historical?access_key=' +
        weatherStackAPIKey +
        '&query=' +
        location +
        '&historical_date=' +
        dates +
        '&hourly=1&interval=' +
        interval +
        '&units=f'
    );
  }

  getForecast(location: string) {
    return this.http.get(
      'https://api.openweathermap.org/data/2.5/forecast?q=' +
        location +
        '&appid=' +
        openWeatherAPIKEY +
        '&units=imperial'
    );
  }
}
