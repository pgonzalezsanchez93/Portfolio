
/*
export interface Task {
  id: string;
  check: boolean;
  description: string;
  list: string[];
  color?: string;
  icon?: string;
}
 */

import { Time } from "@angular/common";


//cambio ya que las listas tienen tareas y no al reves

export interface Task {
  id: string;
  check: boolean;
  description: string;
  color?: string;
  icon?: string;
  listIds: string[];
  startDate?: Date| string;
  startTime?: Time | string;
  endDate?: Date| string;
  endTime?: Time | string;
  allDay?: boolean;
}

