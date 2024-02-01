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
  constructor(private formBuilder: FormBuilder, private wsService: WsService) {}
  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  sendToWS(formValues: FormValues) {
    this.wsService.getWeather(formValues.location).subscribe((data) => {
      this.weatherData = data;

      let totalPrecipitation = 0;
      const dateArray = Object.keys(this.weatherData.historical);

      for (let i = 0; i < dateArray.length; i++) {
        totalPrecipitation +=
          this.weatherData.historical[dateArray[i]].hourly[0].precip;
      }

      console.log(
        'Total precipitation for the last week: ',
        totalPrecipitation + 'mm'
      );
    });
  }
}
