import {  Component, EventEmitter, Input, Output} from '@angular/core';
import { Task} from '../../interfaces/task.interface';
import { List } from '../../interfaces/list.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { ModalComponent } from '../modal/modal.component';



@Component({
  selector: 'app-list',
  templateUrl: `./list.component.html`,
  styleUrl: './list.component.css'
})
export class ListComponent {

@Input() taskList: Task[] = [];
@Input() availableLists: List[] = [];
@Input() displayStyle: 'list' | 'grid' = 'list';

@Output() onTaskStatusChange = new EventEmitter<Task>();
@Output() onTaskEdit = new EventEmitter<Task>();
@Output() onTaskRemove = new EventEmitter<Task>();

constructor(private dialog: MatDialog) {}

// Obtener el nombre de la lista a la que pertenece la tarea
getTaskListName(task: Task): string {
  if (!task.listIds || task.listIds.length === 0) {
    return 'Sin lista';
  }

  const list = this.availableLists.find(l => task.listIds.includes(l.id));
  return list ? list.name : 'Sin lista';
}

// Obtener el icono de la lista a la que pertenece la tarea
getTaskListIcon(task: Task): string {
  if (!task.listIds || task.listIds.length === 0) {
    return 'list';
  }

  const list = this.availableLists.find(l => task.listIds.includes(l.id));
  return list ? list.icon : 'list';
}

// Obtener el color de la lista a la que pertenece la tarea
getTaskListColor(task: Task): string {
  if (!task.listIds || task.listIds.length === 0) {
    return '#757575';
  }

  const list = this.availableLists.find(l => task.listIds.includes(l.id));
  return list ? list.color : '#757575';
}

// Obtener el color de borde para la tarjeta de la tarea
getTaskBorderColor(task: Task): string {
  if (!task.listIds || task.listIds.length === 0) {
    return '3px solid #e0e0e0';
  }

  const list = this.availableLists.find(l => task.listIds.includes(l.id));
  return list ? `3px solid ${list.color}` : '3px solid #e0e0e0';
}

// Contar tareas completadas
getCompletedTasksCount(): number {
  return this.taskList.filter(task => task.check).length;
}

// Cambiar el estado de la tarea (completada/pendiente)
toggleTaskCheck(task: Task): void {
  task.check = !task.check;
  this.onTaskStatusChange.emit(task);
}

// Asignar una tarea a una lista
assignTaskToList(task: Task, list: List): void {
  // Crear una copia de la tarea para no modificar la original directamente
  const updatedTask = { ...task, listIds: [list.id] };
  this.onTaskEdit.emit(updatedTask);
}

// Eliminar una tarea
removeTask(task: Task): void {
  const dialogRef = this.dialog.open(ModalComponent, {
    width: '350px',
    data: { message: `¿Estás seguro de que quieres eliminar la tarea "${task.description}"?` }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.onTaskRemove.emit(task);
    }
  });
}

// Abrir el diálogo de edición de tarea
editTask(task: Task): void {
  const dialogRef = this.dialog.open(EditTaskComponent, {
    width: '500px',
    data: { task: task, availableLists: this.availableLists }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.onTaskEdit.emit(result);
    }
  });
}

// Formatear fecha para mostrar
formatDate(date: Date | string): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Si la fecha es hoy, mostrar "Hoy"
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dateObj);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate.getTime() === today.getTime()) {
    if (dateObj instanceof Date && dateObj.getHours() > 0) {
      return `Hoy, ${dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return 'Hoy';
  }

  // Si la fecha es mañana, mostrar "Mañana"
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (taskDate.getTime() === tomorrow.getTime()) {
    if (dateObj instanceof Date && dateObj.getHours() > 0) {
      return `Mañana, ${dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return 'Mañana';
  }

  // Para el resto de fechas, mostrar fecha completa
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  };

  // Añadir el año solo si es diferente al actual
  if (dateObj.getFullYear() !== new Date().getFullYear()) {
    options.year = 'numeric';
  }

  // Añadir hora si no es un evento de todo el día
  if (dateObj instanceof Date && dateObj.getHours() > 0) {
    return `${dateObj.toLocaleDateString('es-ES', options)}, ${dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  }

  return dateObj.toLocaleDateString('es-ES', options);
}

// Identificador único para el trackBy de ngFor
trackByTaskId(index: number, task: Task): string {
  return task.id || index.toString();
}
}
