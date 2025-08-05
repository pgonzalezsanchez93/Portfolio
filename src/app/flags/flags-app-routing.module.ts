
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlagsHomePageComponent } from './pages/home-page/home-page.component';


const routes: Routes = [
  {
    path: '',
    component: FlagsHomePageComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlagsAppRoutingModule { }
