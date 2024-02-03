import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { WsService } from './ws.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { RouterModule } from '@angular/router';
import { allAppRoutes } from './routes';
import { ReactiveFormsModule } from '@angular/forms';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [AppComponent, WeatherComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(allAppRoutes),
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ],
  providers: [WsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
