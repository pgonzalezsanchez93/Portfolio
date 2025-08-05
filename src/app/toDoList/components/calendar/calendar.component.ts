import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges, OnChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Task } from '../../interfaces/task.interface';
import { List } from '../../interfaces/list.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { CommonModule } from '@angular/common';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})


export class CalendarComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  @Input() tasks: Task[] = [];
  @Input() availableLists: List[] = [];

  @Output() taskAdded = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();

  private _initialized: boolean = false;
  private _styleUpdateAttempts: number = 0;
  private _maxStyleUpdateAttempts: number = 10;
  private _styleUpdateIntervalId: any = null;

  public calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: esLocale,
    selectable: true,
    editable: true,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    events: this.getCalendarEvents.bind(this),
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    height: '100%',
    expandRows: true,
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    slotDuration: '00:30:00',
    nowIndicator: true,
    eventDidMount: (info) => {
      const eventEl = info.el;
      if (eventEl && info.event.title) {
        // Aplicar estilo a tareas completadas
        if (info.event.extendedProps && info.event.extendedProps['taskData'] && info.event.extendedProps['taskData'].check) {
          eventEl.classList.add('completed-task');
          eventEl.style.textDecoration = 'line-through';
          eventEl.style.opacity = '0.8';
        }

        // Accesibilidad
        eventEl.setAttribute('aria-label',
          `Tarea: ${info.event.title}, Fecha: ${
            new Date(info.event.start!).toLocaleDateString('es-ES')
          }${
            info.event.end ? ` hasta ${new Date(info.event.end).toLocaleDateString('es-ES')}` : ''
          }`
        );
        eventEl.setAttribute('tabindex', '0');
      }
    },
    datesSet: () => {
      this._initialized = true;
      this.applyCalendarStyles();

      // Forzar actualización después de un pequeño retraso
      setTimeout(() => {
        this.applyCalendarStyles();
      }, 50);
    },
    // Este evento se dispara después de que el calendario ha sido completamente renderizado
    viewDidMount: () => {
      console.log('Calendar view mounted');
      this._initialized = true;
      this.startPeriodicStyleUpdate();
    }
  };

  constructor(
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Calendar Init - Tasks:', this.tasks);
  }

  ngAfterViewInit(): void {
    // Iniciar actualizaciones periódicas de estilos
    this.startPeriodicStyleUpdate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Calendar Changes - Tasks:', this.tasks);
    if (changes['tasks'] || changes['availableLists']) {
      this.refreshCalendar();
    }
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruye
    this.stopPeriodicStyleUpdate();
  }

  // Iniciar actualizaciones periódicas de estilos
  private startPeriodicStyleUpdate(): void {
    // Detener el intervalo existente si hay uno
    this.stopPeriodicStyleUpdate();

    // Resetear el contador de intentos
    this._styleUpdateAttempts = 0;

    // Crear un nuevo intervalo
    this._styleUpdateIntervalId = setInterval(() => {
      this._styleUpdateAttempts++;

      if (this._styleUpdateAttempts >= this._maxStyleUpdateAttempts) {
        // Detener después de cierto número de intentos
        this.stopPeriodicStyleUpdate();
        return;
      }

      this.applyCalendarStyles();
    }, 200); // Actualizar cada 200ms
  }

  // Detener actualizaciones periódicas
  private stopPeriodicStyleUpdate(): void {
    if (this._styleUpdateIntervalId !== null) {
      clearInterval(this._styleUpdateIntervalId);
      this._styleUpdateIntervalId = null;
    }
  }

  // Método para aplicar estilos al calendario
  private applyCalendarStyles(): void {
    if (!this.calendarComponent || !this.calendarComponent.getApi) return;

    try {
      // Forzar actualización de tamaño
      const api = this.calendarComponent.getApi();
      api.updateSize();

      // Asegurar que los eventos tengan el estilo correcto
      const calendarEl = document.getElementById('main-calendar');
      if (calendarEl) {
        // Forzar repintado forzando un reflow
        void calendarEl.offsetWidth;
      }

      // Actualizar los estilos de eventos completados
      document.querySelectorAll('.fc-event').forEach(eventEl => {
        if (eventEl.classList.contains('completed-task')) {
          (eventEl as HTMLElement).style.textDecoration = 'line-through';
          (eventEl as HTMLElement).style.opacity = '0.8';
        }
      });

      this.changeDetector.detectChanges();
    } catch (error) {
      console.error('Error applying calendar styles:', error);
    }
  }

  // Método para forzar la recarga del calendario
  refreshCalendar(): void {
    console.log('Refreshing calendar...');

    if (!this.calendarComponent || !this.calendarComponent.getApi) {
      console.warn('Calendar API not available yet, will retry shortly');
      // Intentar de nuevo en un momento
      setTimeout(() => this.refreshCalendar(), 100);
      return;
    }

    try {
      // Obtener API del calendario
      const calendarApi = this.calendarComponent.getApi();

      // Refrescar eventos
      calendarApi.refetchEvents();

      // Actualizar tamaño
      calendarApi.updateSize();

      // Aplicar estilos después de un pequeño retraso
      setTimeout(() => {
        this.applyCalendarStyles();

        // Iniciar actualizaciones periódicas
        this.startPeriodicStyleUpdate();
      }, 100);
    } catch (error) {
      console.error('Error refreshing calendar:', error);
    }
  }

  // Método que será llamado por FullCalendar para obtener eventos
  getCalendarEvents(fetchInfo: any, successCallback: any, failureCallback: any): void {
    try {
      const events = this.mapTasksToEvents();
      console.log('Calendar events generated:', events);
      successCallback(events);

      // Forzar actualización de estilos después de cargar eventos
      setTimeout(() => {
        this.applyCalendarStyles();
      }, 50);
    } catch (error) {
      console.error('Error generating calendar events:', error);
      failureCallback(error);
    }
  }

  private mapTasksToEvents(): any[] {
    if (!this.tasks) return [];

    return this.tasks
      .filter(task => {
        // Solo tareas con fecha de inicio válida
        return !!task.startDate;
      })
      .map(task => {
        try {
          // Solo continuar si task.startDate existe
          if (!task.startDate) {
            return null;
          }

          // Convertir a fecha si es string
          let startDate: Date;

          if (typeof task.startDate === 'string') {
            startDate = new Date(task.startDate);
          } else {
            startDate = new Date(task.startDate);
          }

          // Validar fecha
          if (isNaN(startDate.getTime())) {
            console.warn('Invalid start date for task:', task, startDate);
            return null;
          }

          // Procesar fecha fin correctamente
          let endDate: Date | undefined = undefined;
          if (task.endDate) {
            if (typeof task.endDate === 'string') {
              endDate = new Date(task.endDate);
            } else {
              endDate = new Date(task.endDate);
            }

            if (isNaN(endDate.getTime())) {
              console.warn('Invalid end date for task:', task, endDate);
              endDate = undefined;
            }

            if (task.allDay && endDate) {
              if (this.isSameDay(startDate, endDate)) {
                endDate = new Date(endDate);
                endDate.setDate(endDate.getDate() + 1);
              }
            }
          }

          // Determinar color basado en la lista
          let backgroundColor = '#3788d8'; // Azul por defecto

          if (task.listIds && task.listIds.length > 0) {
            const list = this.availableLists.find(l => task.listIds.includes(l.id));
            if (list && list.color) {
              backgroundColor = list.color;
            }
          }

          return {
            id: task.id,
            title: task.description,
            start: startDate,
            end: endDate,
            allDay: task.allDay || false,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            textColor: '#ffffff',
            extendedProps: {
              taskData: task
            },
            classNames: task.check ? ['completed-task'] : []
          };
        } catch (error) {
          console.error('Error mapping task to event:', task, error);
          return null;
        }
      })
      .filter(event => event !== null); // Filtrar eventos nulos
  }

  private handleEventClick(info: any): void {
    const task = info.event.extendedProps['taskData'];
    this.openEditDialog(task);
  }

  private handleDateSelect(info: any): void {
    // Crear una nueva tarea cuando el usuario selecciona una fecha
    const startDate = new Date(info.startStr);
    let endDate: Date;

    if (info.endStr) {
      endDate = new Date(info.endStr);

      if (info.allDay) {
        endDate.setDate(endDate.getDate() - 1);
      }
    } else {
      endDate = new Date(startDate);
    }

    const newTask: Task = {
      id: this.generateUniqueId(),
      check: false,
      description: '',
      listIds: [],
      startDate: startDate,
      endDate: endDate,
      allDay: info.allDay
    };

    this.openEditDialog(newTask, true);
  }

  private handleEventDrop(info: any): void {
    const task = JSON.parse(JSON.stringify(info.event.extendedProps['taskData']));

    // Actualizar fechas
    task.startDate = info.event.start;

    if (info.event.end) {
      task.endDate = info.event.end;

      if (info.event.allDay && task.endDate) {
        const endDate = new Date(task.endDate);
        endDate.setDate(endDate.getDate() - 1);
        task.endDate = endDate;
      }
    } else if (task.endDate) {
      task.endDate = info.event.start;
    }

    task.allDay = info.event.allDay;

    console.log('Event dropped, updated task:', task);
    this.taskUpdated.emit(task);
  }

  private handleEventResize(info: any): void {
    const task = JSON.parse(JSON.stringify(info.event.extendedProps['taskData']));

    // Actualizar fechas
    task.startDate = info.event.start;

    if (info.event.end) {
      task.endDate = info.event.end;

      if (info.event.allDay && task.endDate) {
        const endDate = new Date(task.endDate);
        endDate.setDate(endDate.getDate() - 1);
        task.endDate = endDate;
      }
    }

    console.log('Event resized, updated task:', task);
    this.taskUpdated.emit(task);
  }

  private openEditDialog(task: Task, isNew: boolean = false): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '500px',
      data: {
        task: task,
        availableLists: this.availableLists
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        if (isNew) {
          this.taskAdded.emit(result);
        } else {
          this.taskUpdated.emit(result);
        }

        // Refrescar el calendario después de editar
        setTimeout(() => this.refreshCalendar(), 100);
      }
    });
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
