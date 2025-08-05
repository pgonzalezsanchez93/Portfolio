import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { Product } from '../interfaces/products.interface';

@Injectable({providedIn: 'root'})
export class CatalogoService {

  private url = 'https://fakestoreapi.com/products';


  constructor(
    private http: HttpClient,

  ) {

  }

 getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}` );

  }

}
