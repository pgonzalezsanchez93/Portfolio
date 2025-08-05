import { Component, Input, OnInit } from '@angular/core';
import { WeatherCity } from '../../interface/weather-city.interface';
import { WeatherService } from '../../services/weather.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-weather-results',
  templateUrl: './weather-results.component.html',
  styleUrl: './weather-results.component.css'
})
export class WeatherResultsComponent implements OnInit{

  @Input()
  weatherData!: WeatherCity;

  constructor(
    private weatherService: WeatherService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}


  ngOnChanges() {
    console.log( 'weatherData', this.weatherData );

  }

  ngOnInit(){
    this.activatedRoute.params.pipe(

      switchMap(({ name }) => this.weatherService.getWeatherByCity(name) ),

    ).subscribe( weather => {
      if(!weather) return this.router.navigate(['/weather']);
      this.weatherData = weather;
      console.log({weather});
      return;
    })
  }

  goBack() : void{
    this.router.navigateByUrl('/');
  }

  }



