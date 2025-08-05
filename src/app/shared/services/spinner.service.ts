import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {

  }

  // Método para mostrar el spinner
  show(): void {
    this.loadingSubject.next(true);
  }

  // Método para ocultar el spinner
  hide(): void {
    this.loadingSubject.next(false);
  }
}
