import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApixuService } from '../apixu.service';

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
  constructor(
    private formBuilder: FormBuilder,
    private apixuService: ApixuService
  ) {}
  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  sendToAPIXU(formValues: FormValues) {
    this.apixuService.getWeather(formValues.location).subscribe((data) => {
      this.weatherData = data;
      console.log(this.weatherData);
    });
  }
}
