import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToDoListMainPageComponent } from './pages/main-page/main-page.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  {
    path: '',
    //component: ToDoListMainPageComponent,
    component: ToDoListMainPageComponent,
    children: [
      {
        path: 'calendar',
        component: CalendarComponent
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ToDoListRoutingModule {}
