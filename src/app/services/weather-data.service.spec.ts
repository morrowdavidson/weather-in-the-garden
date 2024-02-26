import { TestBed } from '@angular/core/testing';

import { WeatherDataServiceService } from './weather-data.service';

describe('WeatherDataServiceService', () => {
  let service: WeatherDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
