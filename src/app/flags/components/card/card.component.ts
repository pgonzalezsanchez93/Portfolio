import { Component, Inject, Input } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { FlagCountryService } from '../../services/flag-country.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input()
  country!: Country;

  constructor(
    private dialog: MatDialog,
    private flagService: FlagCountryService,
  ) {}

  // Abre el modal con los datos unicamente del pais seleccionado mediante el ccn3
  openModal() {
    this.flagService.getCountryByCode(this.country.ccn3).subscribe({
      next: (country) => {
        this.dialog.open(ModalComponent, {
          data: { country }
        });
      },
      error: (error) => {
        console.error('Error al obtener los detalles del país:', error);
      }
    });
  }
}
