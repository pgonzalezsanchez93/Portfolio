import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { ActivityRecomendationComponent } from './components/activity-recomendation/activity-recomendation.component';
import { WeatherResultsComponent } from './components/weather-results/weather-results.component';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
import { WeatherHomePageComponent } from './pages/home-page/home-page.component';
import { FormsModule } from '@angular/forms';

import { WeatherAppRoutingModule } from './weather-app-routing.module';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    ActivityRecomendationComponent,
    WeatherResultsComponent,
    WeatherSearchComponent,
    WeatherHomePageComponent,



  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    WeatherAppRoutingModule,
    SharedModule
  ],
  exports: [
    ActivityRecomendationComponent,
    WeatherResultsComponent,
    WeatherSearchComponent,
    WeatherHomePageComponent,

  ]
})
export class WeatherAppModule { }
