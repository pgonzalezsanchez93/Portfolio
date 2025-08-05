import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { List } from '../interfaces/list.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Claves para el almacenamiento en localStorage
  private readonly TASKS_STORAGE_KEY = 'tasks';
  private readonly LISTS_STORAGE_KEY = 'lists';

  // BehaviorSubjects para observar cambios en los datos
  private pendingTasksSubject = new BehaviorSubject<Task[]>([]);
  private completedTasksSubject = new BehaviorSubject<Task[]>([]);
  private listsSubject = new BehaviorSubject<List[]>([]);

  // Observables públicos
  public pendingTasks$: Observable<Task[]> = this.pendingTasksSubject.asObservable();
  public completedTasks$: Observable<Task[]> = this.completedTasksSubject.asObservable();
  public lists$: Observable<List[]> = this.listsSubject.asObservable();

  constructor() {
    // Cargar datos al iniciar el servicio
    this.loadData();
  }

  /**
   * Carga los datos de tareas y listas desde localStorage
   */
  private loadData(): void {
    // Cargar tareas
    const storedTasks = localStorage.getItem(this.TASKS_STORAGE_KEY);
    if (storedTasks) {
      const allTasks: Task[] = JSON.parse(storedTasks);

      // Migración y procesamiento de datos
      allTasks.forEach(task => {
        // Convertir fechas de string a objetos Date
        if (task.startDate) task.startDate = new Date(task.startDate);
        if (task.endDate) task.endDate = new Date(task.endDate);

        // Migrar de 'list' a 'listIds' si es necesario
        if (!task.listIds && (task as any).list) {
          task.listIds = (task as any).list;
          delete (task as any).list;
        }

        // Asegurar que listIds existe
        if (!task.listIds) {
          task.listIds = [];
        }
      });

      // Separar tareas pendientes y completadas
      const pendingTasks = allTasks.filter(task => !task.check);
      const completedTasks = allTasks.filter(task => task.check);

      // Actualizar BehaviorSubjects
      this.pendingTasksSubject.next(pendingTasks);
      this.completedTasksSubject.next(completedTasks);
    }

    // Cargar listas
    const storedLists = localStorage.getItem(this.LISTS_STORAGE_KEY);
    if (storedLists) {
      this.listsSubject.next(JSON.parse(storedLists));
    }
  }

  /**
   * Guarda todas las tareas en localStorage
   */
  private saveTasks(): void {
    const pendingTasks = this.pendingTasksSubject.value;
    const completedTasks = this.completedTasksSubject.value;
    const allTasks = [...pendingTasks, ...completedTasks];

    localStorage.setItem(this.TASKS_STORAGE_KEY, JSON.stringify(allTasks));
  }

  /**
   * Guarda todas las listas en localStorage
   */
  private saveLists(): void {
    localStorage.setItem(this.LISTS_STORAGE_KEY, JSON.stringify(this.listsSubject.value));
  }

  /**
   * Obtiene todas las tareas (pendientes y completadas)
   */
  getAllTasks(): Task[] {
    return [
      ...this.pendingTasksSubject.value,
      ...this.completedTasksSubject.value
    ];
  }

  /**
   * Obtiene las tareas pendientes
   */
  getPendingTasks(): Task[] {
    return this.pendingTasksSubject.value;
  }

  /**
   * Obtiene las tareas completadas
   */
  getCompletedTasks(): Task[] {
    return this.completedTasksSubject.value;
  }

  /**
   * Obtiene todas las listas disponibles
   */
  getLists(): List[] {
    return this.listsSubject.value;
  }

  /**
   * Añade una nueva tarea
   */
  addTask(task: Task): void {
    // Asegurar que la tarea tiene un ID único
    if (!task.id) {
      task.id = this.generateUniqueId();
    }

    // Asegurar que listIds existe
    if (!task.listIds) {
      task.listIds = [];
    }

    // Añadir la tarea a la lista correspondiente
    if (task.check) {
      const completedTasks = [...this.completedTasksSubject.value, task];
      this.completedTasksSubject.next(completedTasks);
    } else {
      const pendingTasks = [...this.pendingTasksSubject.value, task];
      this.pendingTasksSubject.next(pendingTasks);
    }

    // Persistir cambios
    this.saveTasks();
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(task: Task): void {
    // Eliminar la tarea de ambas listas primero
    const pendingTasks = this.pendingTasksSubject.value.filter(t => t.id !== task.id);
    const completedTasks = this.completedTasksSubject.value.filter(t => t.id !== task.id);

    // Añadir la tarea a la lista correspondiente
    if (task.check) {
      this.completedTasksSubject.next([...completedTasks, task]);
    } else {
      this.pendingTasksSubject.next([...pendingTasks, task]);
    }

    // Persistir cambios
    this.saveTasks();
  }

  /**
   * Cambia el estado de una tarea (pendiente/completada)
   */
  toggleTaskStatus(task: Task): void {
    task.check = !task.check;
    this.updateTask(task);
  }

  /**
   * Elimina una tarea
   */
  deleteTask(taskId: string): void {
    const pendingTasks = this.pendingTasksSubject.value.filter(t => t.id !== taskId);
    const completedTasks = this.completedTasksSubject.value.filter(t => t.id !== taskId);

    this.pendingTasksSubject.next(pendingTasks);
    this.completedTasksSubject.next(completedTasks);

    this.saveTasks();
  }

  /**
   * Elimina todas las tareas completadas
   */
  deleteCompletedTasks(): void {
    this.completedTasksSubject.next([]);
    this.saveTasks();
  }

  /**
   * Añade una nueva lista
   */
  addList(list: List): void {
    // Asegurar que la lista tiene un ID único
    if (!list.id) {
      list.id = this.generateUniqueId();
    }

    const lists = [...this.listsSubject.value, list];
    this.listsSubject.next(lists);

    this.saveLists();
  }

  /**
   * Elimina una lista y todas sus referencias en tareas
   */
  deleteList(listId: string): void {
    // Eliminar la lista
    const lists = this.listsSubject.value.filter(l => l.id !== listId);
    this.listsSubject.next(lists);

    // Eliminar referencias a esta lista en todas las tareas
    const pendingTasks = this.pendingTasksSubject.value.map(task => {
      return {
        ...task,
        listIds: task.listIds.filter(id => id !== listId)
      };
    });

    const completedTasks = this.completedTasksSubject.value.map(task => {
      return {
        ...task,
        listIds: task.listIds.filter(id => id !== listId)
      };
    });

    this.pendingTasksSubject.next(pendingTasks);
    this.completedTasksSubject.next(completedTasks);

    // Persistir cambios
    this.saveLists();
    this.saveTasks();
  }

  /**
   * Obtiene las tareas asociadas a una lista específica
   */
  getTasksForList(listId: string): Task[] {
    return this.getAllTasks().filter(task => task.listIds.includes(listId));
  }

  /**
   * Elimina todas las tareas de una lista específica (pero mantiene las tareas)
   */
  clearList(listId: string): void {
    // Eliminar la referencia a esta lista en todas las tareas
    const pendingTasks = this.pendingTasksSubject.value.map(task => {
      return {
        ...task,
        listIds: task.listIds.filter(id => id !== listId)
      };
    });

    const completedTasks = this.completedTasksSubject.value.map(task => {
      return {
        ...task,
        listIds: task.listIds.filter(id => id !== listId)
      };
    });

    this.pendingTasksSubject.next(pendingTasks);
    this.completedTasksSubject.next(completedTasks);

    this.saveTasks();
  }


  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
