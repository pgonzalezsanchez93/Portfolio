import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from '../portfolio/pages/layout-page/layout-page.component';
import { AuthLoginPageComponent } from './pages/login-page/login-page.component';
import { AuthRegisterPageComponent } from './pages/register-page/register-page.component';
import { NgModule } from '@angular/core';
import { PublicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'login', component: AuthLoginPageComponent,  canActivate: [PublicGuard]},
      { path: 'register', component: AuthRegisterPageComponent, canActivate: [PublicGuard]},
      { path: '**', redirectTo: 'login' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild( routes ),

  ],
  exports: [
    RouterModule
  ],
})
export class AuthRoutingModule {}
