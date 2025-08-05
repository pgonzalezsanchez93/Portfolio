import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {


  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.includes('opendatasoft.com') || request.url.includes('openweathermap.org')) {
      console.log('Request1: ', request);
      return next.handle(request);

    }
    // Obtenemos el token del localStorage
    const token = localStorage.getItem('auth_token');

    // Solo añadimos el token a las peticiones a nuestra API de WireMock
    if (request.url.includes('8rkrz.wiremockapi.cloud') && token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
