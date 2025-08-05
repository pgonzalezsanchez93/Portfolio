import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  TownsPageComponent } from './pages/towns-page/towns-page.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';
import {MapComponent } from './components/map/map.component';

import mapboxgl from 'mapbox-gl';
import { TownsRoutingModule } from './towns-routing.module';
import { WeatherAppModule } from "../weatherApp/weather-app.module";
import { HttpClientModule } from '@angular/common/http';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF1Z29uc2EiLCJhIjoiY203eW56N3Y1MGFveTJrcjZkcTluZzE1ayJ9.upiWQdt7raN27CuOfOPA1w';



@NgModule({
  declarations: [
    TownsPageComponent,
    SelectComponent,
    MapComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    TownsRoutingModule,
    HttpClientModule
],
  exports: [
    TownsPageComponent
  ]
})
export class TownsModule { }
