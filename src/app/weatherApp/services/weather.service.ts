import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeatherCity } from '../interface/weather-city.interface';
import { Country } from '../../flags/interfaces/country.interface';


@Injectable({providedIn: 'root'})

export class WeatherService {

  private apiId = '4383d77c128b0dccc282b2f45d145325';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  private weatherSubject = new BehaviorSubject<WeatherCity | null>(null);
  public weather$ = this.weatherSubject.asObservable();

/*   private capitalSubject = new BehaviorSubject<Country | null>(null);
  public capital$ = this.capitalSubject.asObservable(); */

  constructor(private httpClient: HttpClient) { }


  getWeatherByCity(cityName: string): Observable<WeatherCity> {

  const url = `${this.apiUrl}?q=${cityName}&appid=${this.apiId}&units=metric&lang=es`;
  console.log('api de getWeatherByCity');

    return this.httpClient.get<WeatherCity>(url);

  }


}
