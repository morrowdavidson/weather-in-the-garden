import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RainComponent } from './rain/rain.component';
import { RouterModule } from '@angular/router';
import { allAppRoutes } from './routes';
import { ReactiveFormsModule } from '@angular/forms';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { AdvancedViewComponent } from './advanced-view/advanced-view.component';

@NgModule({
  declarations: [AppComponent, RainComponent, AdvancedViewComponent],
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
