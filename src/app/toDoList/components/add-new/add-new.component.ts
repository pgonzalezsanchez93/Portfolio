import { FormControl, Validators } from '@angular/forms';
import { Task } from './../../interfaces/task.interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { List } from '../../interfaces/list.interface';


@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrl: './add-new.component.css'
})
export class AddNewComponent implements OnInit{


@Input() simplified: boolean = false;
@Input() availableLists: List[] = [];

@Output() onNewTask: EventEmitter<Task> = new EventEmitter();


public task: Task = {
  id: '',
  check: false,
  description: '',
  listIds: []
};

public taskDate: Date | null = null;
public selectedListId: string | null = null;

constructor() {}

ngOnInit(): void {

  if (!this.simplified) {
    this.taskDate = new Date();
  }
}

emitTask(): void {
  // Validar que hay descripción
  if (this.task.description.trim().length === 0) {
    return;
  }

  // Crear una nueva tarea con un ID único
  const newTask: Task = {
    id: this.generateUniqueId(),
    check: false,
    description: this.task.description.trim(),
    listIds: []
  };

  // Añadir la lista seleccionada si hay alguna
  if (this.selectedListId) {
    newTask.listIds = [this.selectedListId];
  }

  // Añadir la fecha si se ha seleccionado una
  if (this.taskDate) {
    newTask.startDate = new Date(this.taskDate);
    newTask.allDay = true;
  }

  // Emitir el evento con la nueva tarea
  this.onNewTask.emit(newTask);

  // Resetear el formulario
  this.task = {
    id: '',
    check: false,
    description: '',
    listIds: []
  };

  // Mantener la fecha actual en el formulario completo
  if (!this.simplified) {
    this.taskDate = new Date();
  } else {
    this.taskDate = null;
  }

  this.selectedListId = null;
}

// Generar un ID único para cada tarea
private generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
}
