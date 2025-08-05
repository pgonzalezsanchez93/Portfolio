
export interface List{
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ListWithTasks {
  list: List;
  tasks: string[];
}
