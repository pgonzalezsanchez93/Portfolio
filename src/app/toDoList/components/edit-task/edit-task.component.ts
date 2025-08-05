import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../interfaces/task.interface';
import { List } from '../../interfaces/list.interface';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})

export class EditTaskComponent implements OnInit {
  // La tarea que estamos editando
  editingTask: Task;

  // Para determinar si es una tarea nueva o existente
  isNewTask: boolean = false;

  // Para los selectores de hora
  startTime: string = '12:00';
  endTime: string = '13:00';

  // Opciones de horas para los selectores
  hourOptions: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      task: Task,
      availableLists: List[]
    }
  ) {
    console.log('Edit task dialog opened with task:', data.task);

    // Crear una copia profunda de la tarea para evitar modificar la original
    this.editingTask = JSON.parse(JSON.stringify(data.task));

    // Determinar si es una tarea nueva o existente
    this.isNewTask = !this.editingTask.description;

    // Asegurarse de que listIds existe
    if (!this.editingTask.listIds) {
      this.editingTask.listIds = [];
    }
  }

  ngOnInit(): void {
    // Procesar las fechas y horas
    this.processDateAndTime();

    // Generar opciones de horas
    this.generateTimeOptions();
  }

  // Procesa las fechas y horas de la tarea actual
  private processDateAndTime(): void {
    if (this.editingTask.startDate) {
      // Asegurar que es objeto Date
      const startDate = new Date(this.editingTask.startDate);
      this.editingTask.startDate = startDate;

      // Extraer la hora en formato HH:MM
      const hours = startDate.getHours().toString().padStart(2, '0');
      const minutes = startDate.getMinutes().toString().padStart(2, '0');
      this.startTime = `${hours}:${minutes}`;

      console.log('Processed start date:', startDate, 'Time:', this.startTime);
    }

    if (this.editingTask.endDate) {
      // Asegurar que es objeto Date
      const endDate = new Date(this.editingTask.endDate);
      this.editingTask.endDate = endDate;

      // Extraer la hora en formato HH:MM
      const hours = endDate.getHours().toString().padStart(2, '0');
      const minutes = endDate.getMinutes().toString().padStart(2, '0');
      this.endTime = `${hours}:${minutes}`;

      console.log('Processed end date:', endDate, 'Time:', this.endTime);
    }
  }

  // Genera las opciones de horas
  private generateTimeOptions(): void {
    this.hourOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        this.hourOptions.push(`${formattedHour}:${formattedMinute}`);
      }
    }
  }

  // Método para cancelar la edición
  onCancel(): void {
    this.dialogRef.close();
  }

  // Método para guardar los cambios
  onSave(): void {
    // Si la descripción está vacía, no guardar
    if (!this.editingTask.description || !this.editingTask.description.trim()) {
      return;
    }

    // Aplicar las horas a las fechas
    if (!this.editingTask.allDay) {
      this.applyTimeToDate();
    }

    console.log('Saving task with dates:', {
      startDate: this.editingTask.startDate,
      endDate: this.editingTask.endDate,
      allDay: this.editingTask.allDay
    });

    // Devolver la tarea editada al componente padre
    this.dialogRef.close(this.editingTask);
  }

  // Aplica las horas seleccionadas a las fechas
  private applyTimeToDate(): void {
    if (this.editingTask.startDate) {
      // Obtenemos las horas y minutos del string de tiempo
      const [hours, minutes] = this.startTime.split(':').map(Number);

      // Aplicamos a la fecha de inicio
      const startDate = new Date(this.editingTask.startDate);
      startDate.setHours(hours, minutes, 0, 0);
      this.editingTask.startDate = startDate;
    }

    if (this.editingTask.endDate) {
      // Obtenemos las horas y minutos del string de tiempo
      const [hours, minutes] = this.endTime.split(':').map(Number);

      // Aplicamos a la fecha de fin
      const endDate = new Date(this.editingTask.endDate);
      endDate.setHours(hours, minutes, 0, 0);
      this.editingTask.endDate = endDate;
    }
  }

  // Método para seleccionar una lista para la tarea
  selectList(listId: string): void {
    const index = this.editingTask.listIds.indexOf(listId);
    if (index > -1) {
      // Si ya está en la lista, quitarla
      this.editingTask.listIds.splice(index, 1);
    } else {
      // Si no está en la lista, añadirla
      this.editingTask.listIds.push(listId);
    }
  }

  // Verificar si una lista está seleccionada
  isListSelected(listId: string): boolean {
    return this.editingTask.listIds.includes(listId);
  }

  // Getter para obtener una referencia a la tarea
  get task(): Task {
    return this.editingTask;
  }
}
