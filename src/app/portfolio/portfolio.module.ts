import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { FlagsModule } from "../flags/flags.module";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from '@angular/router';
import { TownsModule } from '../poblacionesEspaña/towns.module';

import { CardListComponent } from './components/card-list/card-list.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthModule } from '../auth/auth.module';

import mapboxgl from 'mapbox-gl';
import { ToDoListModule } from '../toDoList/to-do-list.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    CardListComponent,
    HomePageComponent,
    LayoutPageComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    PortfolioRoutingModule,
    FlagsModule,
    ToDoListModule,
    SharedModule,
    TownsModule,
    RouterModule,
    AuthModule,

],
  exports: [
  HomePageComponent,
  CardListComponent,
  LayoutPageComponent
  ],
  providers: [],
})
export class PortfolioModule { }
