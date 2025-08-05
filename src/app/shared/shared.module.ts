import { NgModule } from '@angular/core';


import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SpinnerComponent } from './components/spinner/spinner.component';



@NgModule({
  declarations: [
    Error404PageComponent,
    ThemeSwitcherComponent,
    SideMenuComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    Error404PageComponent,
    ThemeSwitcherComponent,
    SideMenuComponent,
    RouterModule,
    SpinnerComponent
  ]

})
export class SharedModule { }
