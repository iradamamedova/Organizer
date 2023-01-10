import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  title: string;
  id?: string;
  date?: string;
}
interface CreateResponse {
  name: string;
}
@Injectable({ providedIn: 'root' })
export class TasksService {
  static url =
    'https://angularapp-calendar-organizer-default-rtdb.firebaseio.com/tasks';
  constructor(private http: HttpClient) {}
  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map((tasks) => {
          if (!tasks) {
            return [];
          } else {
            return Object.keys(tasks).map((key: any) => ({
              ...tasks[key],
              id: key,
            }));
          }
        })
      );
  }
  create(task: Task): Observable<Task> {
    return this.http
      .post<any>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(
        map((res) => {
          return { ...task, id: res.name };
        })
      );
  }
  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
  }
}
