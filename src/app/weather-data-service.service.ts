import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherDataService {
  constructor(private apiService: ApiService) {}
}
