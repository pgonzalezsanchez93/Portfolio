import { Component, OnInit } from '@angular/core';
import { WeatherCity } from '../../interface/weather-city.interface';
import { Country } from '../../../flags/interfaces/country.interface';



@Component({
  selector: 'weather-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class WeatherHomePageComponent  {


  weatherData!: WeatherCity;
  countryData!: Country;



  setWeatherData(data: WeatherCity) {
    this.weatherData = data;

  }


}
