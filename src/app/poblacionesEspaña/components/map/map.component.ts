import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { MapService } from '../../services/map.service';
import { AutonomousCommunity } from '../../interfaces/autonomousCommunity.interface';
import { Province } from '../../interfaces/province.interface';
import { Town } from '../../interfaces/town.interface';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'town-map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap?: ElementRef;

  public mainMarker?: Marker;
  public zoom: number = 6;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-6.140981, 40.014768);


  public selectedCommunity: string = '';
  public selectedProvince: string = '';
  public selectedTown: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private mapService: MapService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMap();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    if (!this.divMap) {
      console.error('Elemento del mapa no encontrado');
      return;
    }

    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.currentLngLat,
      zoom: this.zoom,
    });

    this.map.on('load', () => {
      console.log('Mapa cargado correctamente');
      this.initializeMarker();
      this.setupSubscriptions();
    });

    this.setupMapListeners();
  }

  private initializeMarker(): void {
    if (!this.map) {
      console.error('Mapa no inicializado');
      return;
    }

    this.mainMarker = new Marker({
      color: '#FF0000',
      draggable: true
    })
      .setLngLat(this.currentLngLat)
      .addTo(this.map);

    console.log('Marcador inicializado en:', this.currentLngLat);

      //Al terminar de arrastrar el marcador nuevas coordenadas
    this.mainMarker.on('dragend', () => {
      if (!this.mainMarker) return;

      const newPosition = this.mainMarker.getLngLat();
      this.currentLngLat = newPosition;

      console.log('Marcador arrastrado a:', newPosition);

      this.mapService.notifyMarkerDragged(newPosition);
    });
  }
  //Subscripción a la nueva posición del marcador
  private setupSubscriptions(): void {

    this.subscriptions.push(
      this.mapService.coordinates$.subscribe(coordinates => {

        if (this.currentLngLat.lng !== coordinates.lng ||
            this.currentLngLat.lat !== coordinates.lat) {
          this.updateMarkerPosition(coordinates);
              //Si la elección en select cambia el marcador se mueve a la nueva posición
          if (this.mapService.isUpdatingFromSelect()) {
            this.map?.flyTo({
              center: coordinates,
              zoom: this.zoom,
              duration: 1000
            });
          }
        }
      })
    );
    //Subscripción a la comunidad autónoma
    this.subscriptions.push(
      this.mapService.community$.subscribe(community => {
        if (community) {
          this.selectedCommunity = community.acom_name;
          if (this.mapService.isUpdatingFromSelect()) {
            this.adjustZoomForCommunity();
          }
        } else {
          this.selectedCommunity = '';
        }
      })
    );
    // Supscripción a la provincia
    this.subscriptions.push(
      this.mapService.province$.subscribe(province => {
        if (province) {
          this.selectedProvince = province.prov_name;
          if (this.mapService.isUpdatingFromSelect()) {
            this.adjustZoomForProvince();
          }
        } else {
          this.selectedProvince = '';
        }
      })
    );
    // Subscripción a la ciudad
    this.subscriptions.push(
      this.mapService.town$.subscribe(town => {
        if (town) {
          this.selectedTown = town.mun_name;
          if (this.mapService.isUpdatingFromSelect()) {
            this.adjustZoomForTown();
          }
        } else {
          this.selectedTown = '';
        }
      })
    );
  }
//  Añade zoom al mapa
  private setupMapListeners(): void {
    if (!this.map) return;

    this.map.on('zoom', () => {
      if (this.map) {
        this.zoom = this.map.getZoom();
      }
    });


    this.map.on('zoomend', () => {
      if (this.map && this.map.getZoom() > 18) {
        this.map.zoomTo(18);
      }
    });


    this.map.on('move', () => {
      if (this.map) {
        this.currentLngLat = this.map.getCenter();
      }
    });
    // Al hacer click registra las coordenadas y mueve el marcador
    this.map.on('click', (e) => {
      if (!this.mainMarker) return;

      this.mainMarker.setLngLat(e.lngLat);
      this.currentLngLat = e.lngLat;

      console.log('Marcador movido por clic a:', e.lngLat);

      this.mapService.notifyMarkerDragged(e.lngLat);
    });
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  flyToCurrentMarker(): void {
    if (!this.map || !this.mainMarker) return;

    this.map.flyTo({
      center: this.mainMarker.getLngLat(),
      zoom: 10,
      essential: true
    });
  }
  // Posición de marcador actualizada mediante coordenadas
  private updateMarkerPosition(coordinates: LngLat): void {
    if (!this.map || !this.mainMarker) return;

    console.log('Actualizando posición del marcador a:', coordinates);

    this.currentLngLat = coordinates;
    this.mainMarker.setLngLat(coordinates);
  }

  private adjustZoomForCommunity(): void {
    if (!this.map) return;

    this.map.flyTo({
      center: this.currentLngLat,
      zoom: 7,
      duration: 1000
    });
  }

  private adjustZoomForProvince(): void {
    if (!this.map) return;

    this.map.flyTo({
      center: this.currentLngLat,
      zoom: 9,
      duration: 1000
    });
  }

  private adjustZoomForTown(): void {
    if (!this.map) return;

    this.map.flyTo({
      center: this.currentLngLat,
      zoom: 12,
      duration: 1000
    });
  }


}
