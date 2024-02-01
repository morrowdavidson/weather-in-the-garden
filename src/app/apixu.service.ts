import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
const weatherAPIKey = environment.weatherAPIKey;

@Injectable({
  providedIn: 'root',
})
export class ApixuService {
  constructor(private http: HttpClient) {}

  getWeather(location: string) {
    return this.http.get(
      'https://api.weatherstack.com/current?access_key=' +
        weatherAPIKey +
        '&query=' +
        location
    );
  }
}
