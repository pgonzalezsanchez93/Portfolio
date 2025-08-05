import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { ToolBarComponent } from './shared/tool-bar/tool-bar.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { FilterComponent } from './shared/filter/filter.component';
import { ListCardComponent } from './components/list-card/list-card.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    ToolBarComponent,
    LayoutComponent,
    FilterComponent,
    ListCardComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    BrowserModule
  ]
})
export class CatalogoDeProductosModule { }
