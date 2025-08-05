import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherHomePageComponent } from './pages/home-page/home-page.component';



const routes: Routes = [
  {
    path: '',
    component: WeatherHomePageComponent,
  },
  {
    path: ':name',
    component: WeatherHomePageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeatherAppRoutingModule { }
