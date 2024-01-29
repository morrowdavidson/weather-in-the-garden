import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApixuService {
  constructor(private http: HttpClient) {}

  getWeather(location: string) {
    return this.http.get(
      'https://api.weatherstack.com/current?access_key=ea0ff25eb2d202b000af3e4d63ca1a6b&query=' +
        location
    );
  }
}
