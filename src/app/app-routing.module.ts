import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { LayoutPageComponent } from './portfolio/pages/layout-page/layout-page.component';
import { PublicGuard } from './auth/guards/public.guard';



const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: LayoutPageComponent,
     children: [
      {
        path: 'to-do-list',
        loadChildren: () => import('./toDoList/to-do-list.module').then(m => m.ToDoListModule),
          /* canActivate: [ AuthGuard ],
          canMatch: [ AuthGuard ] */
      },
      {
        path: 'weather',
        loadChildren: () => import('./weatherApp/weather-app.module').then(m => m.WeatherAppModule),
      /*   canActivate: [ AuthGuard ],
        canMatch: [ AuthGuard ] */

      },
      {
        path: 'flags',
        loadChildren: () => import('./flags/flags.module').then(m => m.FlagsModule),
  /*       canActivate: [ AuthGuard ],
        canMatch: [ AuthGuard ] */

      },
      {
        path: 'towns',
        loadChildren: () => import('./poblacionesEspaña/towns.module').then(m => m.TownsModule),
       /*  canActivate: [ AuthGuard ],
        canMatch: [ AuthGuard ],
        data: { requiresAdmin: false } */
      },
     /* {
        path: 'catalogue',
        loadChildren: () => import('./catalogo-de-productos/catalogo-de-productos.module').then(m => m.CatalogoDeProductosModule),*/
       /*  canActivate: [ AuthGuard ],
        canMatch: [ AuthGuard ],
        data: { requiresAdmin: false } */
     /* },*/
      {
        path: '',
        loadChildren: () => import('./portfolio/portfolio.module').then(m => m.PortfolioModule),
        /* canActivate: [ AuthGuard ],
        canMatch: [ AuthGuard ] */
      },
     ]
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '**',
    redirectTo: '404'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
