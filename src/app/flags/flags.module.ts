import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlagsGridPageComponent } from './pages/flags-grid-page/flags-grid-page.component';
import { FlagsHomePageComponent } from './pages/home-page/home-page.component';
import { MaterialModule } from '../material/material.module';
import { ModalComponent } from './components/modal/modal.component';
import { CardComponent } from './components/card/card.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MapKeyValuePipe } from './pipes/map-key-value.pipe';
import { CurrencyInfoPipe } from './pipes/currency-info.pipe';
import { FlagsAppRoutingModule } from './flags-app-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    FlagsGridPageComponent,
    FlagsHomePageComponent,
    ModalComponent,
    CardComponent,
    CardListComponent,
    FlagsHomePageComponent,

      //Pipes
    MapKeyValuePipe,
    CurrencyInfoPipe

  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    FlagsAppRoutingModule,
    SharedModule
  ],
  exports: [
    FlagsGridPageComponent,
    FlagsHomePageComponent,
    ModalComponent,
    CardComponent,
    CardListComponent,
    MapKeyValuePipe,
    FlagsHomePageComponent
  ],

  providers: [],
})
export class FlagsModule { }
