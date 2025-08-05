import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../interfaces/products.interface';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.css'
})
export class ListCardComponent implements OnInit{


  products: Product[] = [];

   constructor(
     private catalogoService: CatalogoService,

   ) {}

   ngOnInit(): void {

    this.catalogoService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },

      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

}
