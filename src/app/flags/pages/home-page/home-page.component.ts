import { AfterContentChecked, AfterContentInit, Component, OnChanges, OnInit } from '@angular/core';
import { WeatherService } from '../../../weatherApp/services/weather.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Country } from '../../interfaces/country.interface';
import { WeatherCity } from '../../../weatherApp/interface/weather-city.interface';

@Component({
  selector: 'flags-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class FlagsHomePageComponent  {

  public country?: Country;





}
