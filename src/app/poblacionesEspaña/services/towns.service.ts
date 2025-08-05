
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable, tap } from 'rxjs';
import { AutonomousCommunity, AutonomousCommunityResponse } from '../interfaces/autonomousCommunity.interface';
import { Province, ProvinceResponse } from '../interfaces/province.interface';
import { Town, TownResponse } from '../interfaces/town.interface';

@Injectable ({ providedIn: 'root'})

export class TownsService {
  private baseUrl: string = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-spain-';

  constructor(private http: HttpClient) { }
  //Llamada para imprimir los nombres de las comunidades autónomas
  getAutonomousCommunities(): Observable<AutonomousCommunity[]> {
    return this.http.get<AutonomousCommunityResponse>(`${ this.baseUrl}comunidad-autonoma/records?select=acom_name%2C%20geo_point_2d&limit=20&lang=es`)
    .pipe(
      map( response => response.results),

    );


  }
  // Llamada para sacar los nombres de las provincias que correspondan a la comunidad autónoma seleccionada
  getProvinces( autonomousCommunity: string ): Observable<Province[]> {

    return this.http.get<ProvinceResponse>(`${ this.baseUrl}provincia/records?select=acom_name%2C%20prov_name%2C%20geo_point_2d&limit=10&lang=es&refine=acom_name%3A%22${encodeURIComponent(autonomousCommunity)}%22`)
    .pipe(
      map( response => response.results)
    );
  }
  // Llamada para sacar los municipios pertenecientes a la provincia seleccionada array max 100
  getTowns( autonomousCommunity: string, province: string ): Observable<Town[]> {
    //https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-spain-municipio/records?select=acom_name%2C%20prov_name%2C%20mun_name%2C%20geo_point_2d&order_by=mun_name&limit=100&lang=es&refine=acom_name%3A%22Castilla%20y%20Le%C3%B3n%22&refine=prov_name%3A%22Burgos%22&offset=400
    return this.http.get<TownResponse>(`${ this.baseUrl}municipio/records?select=acom_name%2C%20prov_name%2C%20mun_name%2C%20mun_code%2C%20geo_point_2d&limit=100&lang=es&refine=acom_name%3A%22${encodeURIComponent(autonomousCommunity)}%22&refine=prov_name%3A%22${encodeURIComponent(province)}%22`)
    .pipe(
      map( response => response.results)

    );
  }

}
