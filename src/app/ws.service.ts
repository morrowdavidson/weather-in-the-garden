import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
const weatherAPIKey = environment.weatherAPIKey;

@Injectable({
  providedIn: 'root',
})
export class WsService {
  constructor(private http: HttpClient) {}

  getLastSevenDays() {
    let dates = '';
    for (let i = 0; i < 7; i++) {
      let d = new Date();
      d.setDate(d.getDate() - i);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      dates += year + '-' + month + '-' + day;
      if (i < 6)
        // Don't add a semicolon after the last date
        dates += ';';
    }
    return dates;
  }

  getHistorical(location: string) {
    const dates = this.getLastSevenDays();

    return this.http.get(
      'https://api.weatherstack.com/historical?access_key=' +
        weatherAPIKey +
        '&query=' +
        location +
        '&historical_date=' +
        dates +
        '&hourly=1&interval=24&units=f'
    );
  }
}
