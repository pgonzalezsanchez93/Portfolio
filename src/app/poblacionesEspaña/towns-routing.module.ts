import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TownsPageComponent } from './pages/towns-page/towns-page.component';
import { AuthGuard } from '../auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TownsPageComponent,
    /* canActivate: [AuthGuard], */
   /*  data: { requiresAdmin: false } */
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TownsRoutingModule {}
