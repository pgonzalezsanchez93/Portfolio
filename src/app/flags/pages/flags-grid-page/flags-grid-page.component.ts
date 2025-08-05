import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { FlagCountryService } from '../../services/flag-country.service';

@Component({
  selector: 'app-flags-grid-page',
  templateUrl: './flags-grid-page.component.html',
  styleUrls: ['./flags-grid-page.component.css']
})
export class FlagsGridPageComponent implements OnInit {

  countries: Country[] = [];

  constructor(private flagService: FlagCountryService) {}

  ngOnInit(): void {
    // Cargar solo las banderas al inicio
    this.flagService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error al cargar las banderas:', error);

      }
    });
  }
}
