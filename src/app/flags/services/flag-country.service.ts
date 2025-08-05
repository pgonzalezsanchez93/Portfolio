import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, of, map, retry } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({ providedIn: 'root' })
export class FlagCountryService {
  private baseUrl = 'https://restcountries.com/v3.1';
  private fieldsFlags = 'fields=ccn3,flags';
  private fieldsData = 'fields=ccn3,name,capital,population,flags,currencies,languages,translations';

  // Caché para almacenar detalles de países ya cargados
  private countryCache: Map<string, Country> = new Map();

  constructor(private http: HttpClient) {}

  // Obtiene solo las banderas al cargar la página
  getCountries(): Observable<Country[]> {
    const url = `${this.baseUrl}/all?${this.fieldsFlags}`;
    return this.http.get<Country[]>(url).pipe(
      tap(data => console.log('Banderas cargadas:', data)),
      catchError(error => {
        console.error('Error al cargar las banderas:', error);
        throw error;
      })
    );
  }

  // Obtiene y almacena los detalles de un país cuando se hace clic
  getCountryByCode(code: string): Observable<Country> {
    // Verificar si el país ya está en caché
    if (this.countryCache.has(code)) {
      console.log('Detalles del país cargados desde caché:', this.countryCache.get(code));
      return of(this.countryCache.get(code)!);
    }

    // Si no está en caché, obtener detalles desde la API
    const url = `${this.baseUrl}/alpha/${code}?${this.fieldsData}`;

    return this.http.get<Country>(url).pipe(
      retry(30),
      tap(data => {
        this.countryCache.set(code, data); // Guardar en caché
        console.log('Country details fetched:', data);

      }),
      catchError(error => {
        console.error('Error al cargar los detalles del país:', error);
        throw error;
      })
    );
  }
}
