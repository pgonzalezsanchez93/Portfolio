import { Component } from '@angular/core';
import { Product } from '../../interfaces/products.interface';
import { CatalogoService } from '../../services/catalogo.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  product?: Product[];

  constructor(
    private catalogoService: CatalogoService,

  ) {



  }






}
