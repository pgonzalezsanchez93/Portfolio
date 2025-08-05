
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddNewComponent } from './components/add-new/add-new.component';
import { ListComponent } from './components/list/list.component';
import { ModalComponent } from './components/modal/modal.component';
import { ToDoListMainPageComponent } from './pages/main-page/main-page.component';
import { MaterialModule } from '../material/material.module';
import { ListManagerComponent } from './components/list-manager/list-manager.component';
import { ToDoListRoutingModule } from './to-do-list-routing.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@fullcalendar/core'
import { TaskService } from './services/task.service';




@NgModule({
  declarations: [
    AddNewComponent,
    ListComponent,
    ModalComponent,
    ToDoListMainPageComponent,
    ListManagerComponent,
    EditTaskComponent,
    CalendarComponent,



  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FullCalendarModule,
    ToDoListRoutingModule,
    ReactiveFormsModule,
    FullCalendarModule,



  ],
  exports: [
    ToDoListMainPageComponent,
    ModalComponent
  ],
  providers: [ provideNativeDateAdapter(),
    TaskService
  ]
})
export class ToDoListModule { }
