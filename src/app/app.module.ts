import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RainComponent } from './rain/rain.component';
import { RouterModule } from '@angular/router';
import { allAppRoutes } from './routes';
import { ReactiveFormsModule } from '@angular/forms';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { AdvancedViewComponent } from './advanced-view/advanced-view.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BasicViewComponent } from './basic-view/basic-view.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { TempPrecipChartComponent } from './temp-precip-chart/temp-precip-chart.component';
import { TotalPrecipChartComponent } from './total-precip-chart/total-precip-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    RainComponent,
    AdvancedViewComponent,
    NavBarComponent,
    BasicViewComponent,
    AdvancedSearchComponent,
    TempPrecipChartComponent,
    TotalPrecipChartComponent,
  ],
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
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
