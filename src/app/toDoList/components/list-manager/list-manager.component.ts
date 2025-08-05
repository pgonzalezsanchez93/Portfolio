import { Component, EventEmitter, Output } from '@angular/core';
import { List } from '../../interfaces/list.interface';



/* interface MenuOption {
  label: string;
  icon: string;
  value: string;
}

@Component({
  selector: 'app-list-manager',
  templateUrl: './list-manager.component.html',
  styleUrl: './list-manager.component.css'
})


export class ListManagerComponent {

  public newListName: string = '';
  public newListColor: string = '#42A5F5';
  public newListIcon: string = 'favorite';

  public menuOptions: MenuOption[] = [
    { label: 'Remarcado', icon: 'star', value: 'Remarcado' },
    { label: 'Favoritos', icon: 'favorite', value: 'Favoritos' },
    { label: 'Importante', icon: 'priority_high', value: 'Importante' },
    { label: 'Trabajo', icon: 'work', value: 'Trabajo' },
    { label: 'Urgente', icon: 'bolt', value: 'Urgente' },
  ];

  @Output()
  listCreated = new EventEmitter<List>();

  // Añadir una lista nueva
  addNewList(): void {
    if(!this.newListName.trim()) return;

    const newList: List = {
      id: this.generateUniqueId(),
      name: this.newListName.trim(),
      color: this.newListColor,
      icon: this.newListIcon
    };

    this.listCreated.emit(newList);

    // Resetear form
    this.newListName = '';
    this.newListColor = '#42A5F5';
    this.newListIcon = 'favorite';
  }


  //Generar un ID único para cada tarea
  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

 */

interface IconOption {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-list-manager',
  templateUrl: './list-manager.component.html',
  styleUrls: ['./list-manager.component.css']
})
export class ListManagerComponent {
  // Datos del formulario
  public newListName: string = '';
  public newListColor: string = '#3f51b5';
  public newListIcon: string = 'list';

  // Opciones de iconos disponibles
  public menuOptions: IconOption[] = [
    { label: 'Lista', icon: 'list' },
    { label: 'Favorito', icon: 'star' },
    { label: 'Importante', icon: 'priority_high' },
    { label: 'Trabajo', icon: 'work' },
    { label: 'Casa', icon: 'home' },
    { label: 'Compras', icon: 'shopping_cart' },
    { label: 'Salud', icon: 'favorite' },
    { label: 'Viajes', icon: 'flight' },
    { label: 'Finanzas', icon: 'account_balance' },
    { label: 'Educación', icon: 'school' },
    { label: 'Proyecto', icon: 'architecture' },
    { label: 'Ocio', icon: 'sports_esports' },
    { label: 'Música', icon: 'music_note' },
    { label: 'Familia', icon: 'people' },
    { label: 'Amigos', icon: 'group' },
    { label: 'Eventos', icon: 'event' },
    { label: 'Libros', icon: 'book' },
    { label: 'Películas', icon: 'movie' },
    { label: 'Recordatorio', icon: 'notifications' },
    { label: 'Urgente', icon: 'bolt' }
  ];

  @Output() listCreated = new EventEmitter<List>();

  // Obtener la etiqueta correspondiente a un icono
  getIconLabel(icon: string): string {
    const option = this.menuOptions.find(opt => opt.icon === icon);
    return option ? option.label : 'Icono';
  }

  // Añadir una nueva lista
  addNewList(): void {
    // Validar que hay un nombre
    if (!this.newListName.trim()) {
      return;
    }

    // Crear una nueva lista
    const newList: List = {
      id: this.generateUniqueId(),
      name: this.newListName.trim(),
      color: this.newListColor,
      icon: this.newListIcon
    };

    // Emitir el evento con la nueva lista
    this.listCreated.emit(newList);

    // Resetear el formulario pero mantener el color y el icono
    this.newListName = '';
  }

  // Generar un ID único para cada lista
  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

