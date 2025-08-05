import { Component, Output, EventEmitter, Inject, Input } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { WeatherCity } from '../../interface/weather-city.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Country } from '../../../flags/interfaces/country.interface';


@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html'
})
export class WeatherSearchComponent {

  cityName: string = '';

  private readonly CAPITAL_KEY = 'capitalSelected';





  //EventEmitter
  @Output()
  weatherResult: EventEmitter<WeatherCity> = new EventEmitter<WeatherCity>();

  @Output()
  capitalResult: EventEmitter<Country> = new EventEmitter<Country>();


  constructor(private weatherService: WeatherService) {}

  //Método para buscar los datos segun el nombre de la ciudad
  searchCity() {

    if (this.cityName.trim()) {

      console.log('Searching for:', this.cityName);

      this.weatherService.getWeatherByCity(this.cityName)
        .subscribe(
          (data: WeatherCity ) => {

            console.log('Weather data:', data);

            this.weatherResult.emit(data);

          },
          (error: HttpErrorResponse) => {

            console.error('Error:', error);

          }
        );
    }

  }

}
