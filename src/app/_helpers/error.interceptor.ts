import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 401:
              errorMessage = 'No autorizado: Debe iniciar sesión nuevamente';
              // Si es un error de autorización, limpiar la sesión
              this.authService.logout();
              break;
            case 403:
              errorMessage = 'Acceso prohibido: No tiene permisos para acceder a este recurso';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error del servidor: Por favor, inténtelo más tarde';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
              break;
          }
        }

        // Mostrar mensaje de error al usuario
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        // Propagar el error
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
