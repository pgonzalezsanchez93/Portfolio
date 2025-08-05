import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { WeatherHomePageComponent } from "../weatherApp/pages/home-page/home-page.component";
import { FlagsHomePageComponent } from "../flags/pages/home-page/home-page.component";
import { TownsPageComponent } from '../poblacionesEspaña/pages/towns-page/towns-page.component';
import { ToDoListMainPageComponent } from "../toDoList/pages/main-page/main-page.component";



const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,

  },
  {
    path: 'home',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule {}
