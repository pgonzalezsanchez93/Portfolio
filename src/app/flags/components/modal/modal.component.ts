import { AfterViewChecked, Component, Inject, Input, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';

import { WeatherCity } from '../../../weatherApp/interface/weather-city.interface';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {

  country?: Country;
  loading = true;
  errorMessage: string = '';
  public weather?: WeatherCity;

  constructor(

    @Inject(MAT_DIALOG_DATA) public data: {country: Country},


  ) { //Equiparo la data con country para que se vean en el modal
    this.country = data.country;

  }
  // He usado un get para languages porque me estaba dado problemas al llamarlo directamente en el html
  getLanguages(languages: any): string[] {
    if (!languages) return [];
    return Object.values(languages);
  }


}





