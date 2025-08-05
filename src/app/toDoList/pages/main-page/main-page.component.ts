import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../interfaces/task.interface';
import { ModalComponent } from '../../components/modal/modal.component';
import { List } from '../../interfaces/list.interface';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CalendarComponent } from '../../components/calendar/calendar.component';



@Component({
  selector: 'to-do-list-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class ToDoListMainPageComponent   implements OnInit {


  public tasks: Task[] = [];
  public availableLists: List[] = [];
  public isCalendarView: boolean = false;
  public selectedList: List | null = null;
  public isGrouped: boolean = true;
  public filterMode: 'all' | 'pending' | 'completed' | 'today' | 'upcoming' = 'all';
  public showListManager: boolean = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Cargar datos guardados
    this.loadFromLocalStorage();
  }

  // Gestionar cambio de pestañas
  onTabChange(event: any): void {
    this.isCalendarView = event.index === 1;
  }

  // Gestión de tareas
  onNewTask(task: Task): void {
    // Si hay una lista seleccionada, añadir la tarea a esa lista
    if (this.selectedList) {
      task.listIds = [this.selectedList.id];
    }

    this.tasks.push(task);
    this.saveToLocalStorage();
  }

  onTaskStatusChange(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
      this.saveToLocalStorage();
    }
  }

  onTaskEdit(editedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === editedTask.id);
    if (index !== -1) {
      this.tasks[index] = editedTask;
      this.saveToLocalStorage();
    }
  }

  // Gestión de listas
  onNewListCreated(list: List): void {
    this.availableLists.push(list);
    // Opcionalmente, seleccionar automáticamente la nueva lista
    this.selectedList = list;
    this.saveToLocalStorage();
  }

  deleteList(list: List): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: { message: `¿Estás seguro de que quieres eliminar la lista "${list.name}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Eliminar la lista del array de listas disponibles
        this.availableLists = this.availableLists.filter(l => l.id !== list.id);

        // Si la lista eliminada es la seleccionada, deseleccionar
        if (this.selectedList && this.selectedList.id === list.id) {
          this.selectedList = null;
        }

        // Actualizar las tareas para eliminar la referencia a esta lista
        this.tasks = this.tasks.map(task => {
          if (task.listIds.includes(list.id)) {
            return {
              ...task,
              listIds: task.listIds.filter(id => id !== list.id)
            };
          }
          return task;
        });

        this.saveToLocalStorage();
      }
    });
  }

  onDeleteTasks(list: List): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: { message: `¿Estás seguro de que quieres eliminar todas las tareas de la lista "${list.name}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasks = this.tasks.filter(task => !task.listIds.includes(list.id));
        this.saveToLocalStorage();
      }
    });
  }

  // Método para eliminar tareas completadas de una lista específica
  deleteCompletedTasksFromList(listId: string | null): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: {
        message: listId
          ? `¿Estás seguro de que quieres eliminar las tareas completadas de esta lista?`
          : `¿Estás seguro de que quieres eliminar las tareas completadas sin lista asignada?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (listId) {
          // Eliminar tareas completadas de una lista específica
          this.tasks = this.tasks.filter(task =>
            !(task.check && task.listIds.includes(listId))
          );
        } else {
          // Eliminar tareas completadas sin lista asignada
          this.tasks = this.tasks.filter(task =>
            !(task.check && (!task.listIds || task.listIds.length === 0))
          );
        }
        this.saveToLocalStorage();
      }
    });
  }

  // Métodos para obtener subconjuntos de tareas
  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksForList(list: List): Task[] {
    return this.tasks.filter(task => task.listIds.includes(list.id));
  }

  getUnassignedTasks(): Task[] {
    return this.tasks.filter(task => !task.listIds || task.listIds.length === 0);
  }

  getFilteredTasks(): Task[] {
    let filteredTasks = this.tasks;

    // Filtrar según el modo seleccionado
    switch (this.filterMode) {
      case 'pending':
        filteredTasks = filteredTasks.filter(task => !task.check);
        break;
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.check);
        break;
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filteredTasks = filteredTasks.filter(task => {
          if (!task.startDate) return false;
          const taskDate = new Date(task.startDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
        break;
      case 'upcoming':
        const tomorrow = new Date();
        tomorrow.setHours(0, 0, 0, 0);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filteredTasks = filteredTasks.filter(task => {
          if (!task.startDate) return false;
          const taskDate = new Date(task.startDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() >= tomorrow.getTime();
        });
        break;
    }

    return filteredTasks;
  }

  // Comprobar si una lista tiene tareas completadas
  hasCompletedTasks(listId: string | null): boolean {
    if (listId) {
      return this.tasks.some(task => task.check && task.listIds.includes(listId));
    } else {
      return this.tasks.some(task =>
        task.check && (!task.listIds || task.listIds.length === 0)
      );
    }
  }

  // Cambiar el modo de agrupación
  toggleGrouping(): void {
    this.isGrouped = !this.isGrouped;
  }

  // Persistencia de datos
  private saveToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('lists', JSON.stringify(this.availableLists));
  }

  private loadFromLocalStorage(): void {
    const savedTasks = localStorage.getItem('tasks');
    const savedLists = localStorage.getItem('lists');

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
      // Convertir las fechas de string a Date
      this.tasks.forEach(task => {
        if (task.startDate) {
          task.startDate = new Date(task.startDate);
        }
        if (task.endDate) {
          task.endDate = new Date(task.endDate);
        }
      });
    }

    if (savedLists) {
      this.availableLists = JSON.parse(savedLists);
    }
  }
}
