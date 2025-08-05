import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LngLat } from 'mapbox-gl';
import { AutonomousCommunity } from '../interfaces/autonomousCommunity.interface';
import { Province } from '../interfaces/province.interface';
import { Town } from '../interfaces/town.interface';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  private coordinatesSubject = new BehaviorSubject<LngLat>(new LngLat(-3.7492, 40.4637));
  public coordinates$ = this.coordinatesSubject.asObservable();


  private communitySubject = new BehaviorSubject<AutonomousCommunity | null>(null);
  public community$ = this.communitySubject.asObservable();

  private provinceSubject = new BehaviorSubject<Province | null>(null);
  public province$ = this.provinceSubject.asObservable();

  private townSubject = new BehaviorSubject<Town | null>(null);
  public town$ = this.townSubject.asObservable();


  private markerDraggedSubject = new Subject<LngLat>();
  public markerDragged$ = this.markerDraggedSubject.pipe(

    debounceTime(100)
  );


  private _updatingFromMap = false;
  private _updatingFromSelect = false;

  constructor() {

    this.markerDragged$.subscribe(coordinates => {

      this._updatingFromMap = true;
      this.coordinatesSubject.next(coordinates);
      this._updatingFromMap = false;
    });
  }

  isUpdatingFromMap(): boolean {
    return this._updatingFromMap;
  }

  isUpdatingFromSelect(): boolean {
    return this._updatingFromSelect;
  }

  getCoordinates(): LngLat {
    return this.coordinatesSubject.getValue();
  }

  getCommunity(): AutonomousCommunity | null {
    return this.communitySubject.getValue();
  }

  getProvince(): Province | null {
    return this.provinceSubject.getValue();
  }

  getTown(): Town | null {
    return this.townSubject.getValue();
  }

  // Actualiza las coordenadas si hay una comunidad seleccionada y si tiene coordenadas
  updateFromSelectCommunity(community: AutonomousCommunity | null): void {
    this._updatingFromSelect = true;

    this.communitySubject.next(community);

    if (community && community.geo_point_2d) {
      this.coordinatesSubject.next(
        new LngLat(community.geo_point_2d.lon, community.geo_point_2d.lat)
      );
    }

    this._updatingFromSelect = false;
  }
    // Actualiza las coordenadas si hay una provincia seleccionada y si tiene coordenadas
  updateFromSelectProvince(province: Province | null): void {
    this._updatingFromSelect = true;

    this.provinceSubject.next(province);

    if (province && province.geo_point_2d) {
      this.coordinatesSubject.next(
        new LngLat(province.geo_point_2d.lon, province.geo_point_2d.lat)
      );
    }

    this._updatingFromSelect = false;
  }
    // Actualiza las coordenadas si hay un municipio seleccionado y si tiene coordenadas
  updateFromSelectTown(town: Town | null): void {
    this._updatingFromSelect = true;

    this.townSubject.next(town);

    if (town && town.geo_point_2d) {
      this.coordinatesSubject.next(
        new LngLat(town.geo_point_2d.lon, town.geo_point_2d.lat)
      );
    }
    this._updatingFromSelect = false;
  }
  //Devuelve nuevas coordenadas si el marcador se ha movido
  notifyMarkerDragged(coordinates: LngLat): void {
    this.markerDraggedSubject.next(coordinates);
  }
  // Resetea el valor de provincia y municipio
  resetSelections(): void {
    this.provinceSubject.next(null);
    this.townSubject.next(null);
  }
  // Actualiza todas las selecciones
  updateAllSelections(community: AutonomousCommunity | null, province: Province | null, town: Town | null): void {
    this._updatingFromSelect = true;

    this.provinceSubject.next(province);
    this.townSubject.next(town);

    if (town && town.geo_point_2d) {
      this.coordinatesSubject.next(
        new LngLat(town.geo_point_2d.lon, town.geo_point_2d.lat)
      );
    } else if (province && province.geo_point_2d) {
      this.coordinatesSubject.next(
        new LngLat(province.geo_point_2d.lon, province.geo_point_2d.lat)
      );
    } else if (community && community.geo_point_2d) {
      this.coordinatesSubject.next(
        new LngLat(community.geo_point_2d.lon, community.geo_point_2d.lat)
      );
    }

    this._updatingFromSelect = false;
  }
}
