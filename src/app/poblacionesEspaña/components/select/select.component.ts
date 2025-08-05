import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TownsService } from '../../services/towns.service';
import { MapService } from '../../services/map.service';
import { AutonomousCommunity } from '../../interfaces/autonomousCommunity.interface';
import { Province } from '../../interfaces/province.interface';
import { Town } from '../../interfaces/town.interface';
import { Subscription } from 'rxjs';
import { LngLat } from 'mapbox-gl';


@Component({
  selector: 'town-select-component',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit, OnDestroy {
  public myForm: FormGroup;
  public loadingLocation = false;

  public autonomousCommunities: AutonomousCommunity[] = [];
  public provinces: Province[] = [];
  public towns: Town[] = [];

  private subscriptions: Subscription[] = [];
  private processingDrag = false;

  constructor(
    private fb: FormBuilder,
    private townsService: TownsService,
    private mapService: MapService
  ) {
    this.myForm = this.fb.group({
      autonomousCommunity: ['', Validators.required],
      province: ['', Validators.required],
      town: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAutonomousCommunities();
      //Subscripción a las nuevas coordenadas
    this.subscriptions.push(
      this.mapService.markerDragged$.subscribe(coordinates => {
        if (!this.processingDrag) {
          console.log('Detectado arrastre del marcador a:', coordinates);
          this.findLocationByCoordinates(coordinates);
        }
      })
    );

    this.subscriptions.push(
      this.mapService.community$.subscribe(community => {
        if (community && !this.processingDrag && !this.mapService.isUpdatingFromMap()) {
          const currentValue = this.myForm.get('autonomousCommunity')?.value;


          if (!currentValue || currentValue.acom_name !== community.acom_name) {
            console.log('Actualizando select de comunidad a:', community.acom_name);
            this.myForm.get('autonomousCommunity')?.setValue(community);


            if (!this.processingDrag) {
              this.loadProvinces(community.acom_name);
            }
          }
        }
      })
    );


    this.subscriptions.push(
      this.mapService.province$.subscribe(province => {
        if (province && !this.processingDrag && !this.mapService.isUpdatingFromMap()) {
          const currentValue = this.myForm.get('province')?.value;
          const community = this.myForm.get('autonomousCommunity')?.value as AutonomousCommunity;


          if (!currentValue || currentValue.prov_name !== province.prov_name) {
            console.log('Actualizando select de provincia a:', province.prov_name);
            this.myForm.get('province')?.setValue(province);


            if (!this.processingDrag && community) {
              this.loadTowns(community.acom_name, province.prov_name);
            }
          }
        }
      })
    );

    this.subscriptions.push(
      this.mapService.town$.subscribe(town => {
        if (town && !this.processingDrag && !this.mapService.isUpdatingFromMap()) {
          const currentValue = this.myForm.get('town')?.value;

          if (!currentValue || currentValue.mun_name !== town.mun_name) {
            console.log('Actualizando select de municipio a:', town.mun_name);
            this.myForm.get('town')?.setValue(town);
          }
        }
      })
    );
  }
  //Destruye la subscripción
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Carga las comunidades automonas en el select
  loadAutonomousCommunities(): void {
    this.townsService.getAutonomousCommunities()
      .subscribe({
        next: (communities) => {
          this.autonomousCommunities = communities;
          console.log('Comunidades autónomas cargadas:', communities.length);
        },
        error: (error) => console.error('Error al cargar las Comunidades Autónomas.', error)
      });
  }
  // Carga las provincias subscribiendose a la comunidad seleccionada
  loadProvinces(communityName: string): void {
    this.townsService.getProvinces(communityName).subscribe({
      next: (provinces) => {
        this.provinces = provinces;
        console.log('Provincias cargadas:', provinces.length);
      },
      error: (error) => console.error('Error al cargar las Provincias.', error)
    });
  }
    // Carga los municipios subscribiendose a la comunidad y a la provincia seleccionada
  loadTowns(communityName: string, provinceName: string): void {
    this.townsService.getTowns(communityName, provinceName).subscribe({
      next: (towns) => {
        this.towns = towns;
        console.log('Municipios cargados1:', towns.length);
      },
      error: (error) => console.error('Error al cargar los Municipios.', error)
    });

  }
  // Una vez que la comunidad es seleccionada se actualiza el marcador en el mapa
  // se buscan los valores, si los hay de provincia y municipio y se resetean las selecciones
  onCommunitySelected(event: any): void {
    const selectedCommunity = event.value;
    if (!selectedCommunity) return;

    console.log('Comunidad seleccionada manualmente:', selectedCommunity.acom_name);

    this.mapService.updateFromSelectCommunity(selectedCommunity);

    this.myForm.get('province')?.setValue('');
    this.myForm.get('town')?.setValue('');
    this.mapService.resetSelections();

    this.loadProvinces(selectedCommunity.acom_name);
  }
  //Una vez que la comunidad y la provincia estan seleccionadas se actualiza el marcador en el mapa
  // se buscan los valores, si los hay de  municipio y se resetean las selecciones
  onProvinceSelected(event: any): void {
    const selectedProvince = event.value;
    const selectedCommunity = this.myForm.get('autonomousCommunity')?.value as AutonomousCommunity;

    if (!selectedProvince || !selectedCommunity) return;

    console.log('Provincia seleccionada manualmente:', selectedProvince.prov_name);

    this.mapService.updateFromSelectProvince(selectedProvince);

    this.myForm.get('town')?.setValue('');

    this.loadTowns(selectedCommunity.acom_name, selectedProvince.prov_name);
  }
  // Devuelve valor del municipio seleccionado y actualiza el marcador en el mapa
  onTownSelected(event: any): void {
    const selectedTown = event.value;
    if (!selectedTown) return;

    console.log('Municipio seleccionado manualmente:', selectedTown.mun_name);

    this.mapService.updateFromSelectTown(selectedTown);
  }
  //Si el marcador ha sido arrastrado busca la comunidad mas cercana segun coordenadas
  // actualiza el valor del select y carga las provincias de la comunidad seleccionada
  findLocationByCoordinates(coordinates: LngLat): void {
    this.processingDrag = true;
    this.loadingLocation = true;

    console.log('Buscando ubicación para coordenadas:', coordinates);

    this.findClosestCommunity(coordinates).then(closestCommunity => {
      if (closestCommunity) {
        console.log('Comunidad más cercana encontrada:', closestCommunity.acom_name);

        this.myForm.get('autonomousCommunity')?.setValue(closestCommunity);

        return this.loadProvincesAsync(closestCommunity.acom_name).then(() => {
          return this.findClosestProvince(coordinates);
        });
      }
      return null;
      //Una vez seleccionada la comunidad, busca  la provincia mas cercana segun coordenadas,
      //
    }).then(closestProvince => {
      if (closestProvince) {
        console.log('Provincia más cercana encontrada:', closestProvince.prov_name);

        const selectedCommunity = this.myForm.get('autonomousCommunity')?.value as AutonomousCommunity;
        this.myForm.get('province')?.setValue(closestProvince);

        return this.loadTownsAsync(selectedCommunity.acom_name, closestProvince.prov_name).then(() => {
          return this.findClosestTown(coordinates);
        });
      }
      return null;
      // Una vez seleccionada la provincia , busca el municipio mas cercano
    }).then(closestTown => {
      if (closestTown) {
        console.log('Municipio más cercano encontrado:', closestTown.mun_name);

        this.myForm.get('town')?.setValue(closestTown);
      }

      this.loadingLocation = false;
      // Coge los valores de los select
      const community = this.myForm.get('autonomousCommunity')?.value as AutonomousCommunity;
      const province = this.myForm.get('province')?.value as Province;
      const town = this.myForm.get('town')?.value as Town;

      if (community) {
        //Actualiza las selecciones
        this.mapService.updateAllSelections(community, province, town);
      }

      setTimeout(() => {
        this.processingDrag = false;
      }, 300);

    }).catch(error => {
      console.error('Error al buscar ubicación por coordenadas:', error);
      this.loadingLocation = false;
      this.processingDrag = false;
    });
  }
  // Carga las provincias de forma asincrona segun la comunidad
  private loadProvincesAsync(communityName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.townsService.getProvinces(communityName).subscribe({
        next: (provinces) => {
          this.provinces = provinces;
          console.log('Provincias cargadas de forma asíncrona:', provinces.length);
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar las Provincias de forma asíncrona:', error);
          reject(error);
        }
      });
    });
  }
    // Carga los municipios de forma asincrona segun la comunidad y la provincia
  private loadTownsAsync(communityName: string, provinceName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.townsService.getTowns(communityName, provinceName).subscribe({
        next: (towns) => {
          this.towns = towns;
          console.log('Municipios cargados de forma asíncrona:', towns.length);
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar los Municipios de forma asíncrona:', error);
          reject(error);
        }
      });

    });
  }
  // Busca por coordenadas la comunidad mas cercana, y se subscribe
  private findClosestCommunity(coordinates: LngLat): Promise<AutonomousCommunity | null> {
    if (this.autonomousCommunities.length === 0) {
      return new Promise((resolve, reject) => {
        this.townsService.getAutonomousCommunities().subscribe({
          next: (communities) => {
            this.autonomousCommunities = communities;
            resolve(this.findClosestLocation(coordinates, communities));
          },
          error: (error) => {
            console.error('Error al cargar las Comunidades Autónomas:', error);
            reject(error);
          }
        });
      });
    }

    return Promise.resolve(this.findClosestLocation(coordinates, this.autonomousCommunities));
  }
   // Busca por coordenadas la provincia mas cercana,
  private findClosestProvince(coordinates: LngLat): Promise<Province | null> {
    return Promise.resolve(this.findClosestLocation(coordinates, this.provinces));
  }
  // Busca por coordenadas lel municipio mas cercano
  private findClosestTown(coordinates: LngLat): Promise<Town | null> {
    return Promise.resolve(this.findClosestLocation(coordinates, this.towns));
  }
  //Busca la localización, coordenadas mas cercanas
  private findClosestLocation<T extends { geo_point_2d?: { lat: number, lon: number } }>(
    coordinates: LngLat,
    locations: T[]
  ): T | null {
    if (!locations || locations.length === 0) return null;

    let closestLocation: T | null = null;
    let minDistance = Number.MAX_VALUE;

    for (const location of locations) {
      if (!location.geo_point_2d) continue;

      const distance = this.calculateDistance(
        coordinates.lat, coordinates.lng,
        location.geo_point_2d.lat, location.geo_point_2d.lon
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = location;
      }
    }

    return closestLocation;
  }
  /**La fórmula del semiverseno, también conocida como Fórmula de Harversine, es una importante ecuación
   * para la navegación astronómica, en cuanto al cálculo de la distancia de círculo máximo entre dos
   * puntos de un globo sabiendo su longitud y su latitud. */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
