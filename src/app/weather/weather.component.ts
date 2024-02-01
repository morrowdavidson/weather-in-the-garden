import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WsService } from '../ws.service';

interface FormValues {
  location: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent {
  public weatherSearchForm!: FormGroup;
  public weatherData: any;
  public totalPrecipitation: number = 0;

  constructor(private formBuilder: FormBuilder, private wsService: WsService) {}
  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  sendToWS(formValues: FormValues) {
    this.wsService.getWeather(formValues.location).subscribe((data) => {
      this.weatherData = data;

      const dateArray = Object.keys(this.weatherData.historical);

      this.totalPrecipitation = 0;

      for (let i = 0; i < dateArray.length; i++) {
        this.totalPrecipitation +=
          this.weatherData.historical[dateArray[i]].hourly[0].precip;
      }

      console.log(
        'Total precipitation for the last week: ',
        this.totalPrecipitation + 'mm'
      );
    });
  }
}
