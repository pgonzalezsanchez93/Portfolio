import { Injectable } from '@angular/core';
import { CanActivate, CanMatch, Router, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanMatch {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const requiresAdmin = route.data['requiresAdmin'] === true;
    return this.checkAuth(requiresAdmin);
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    const requiresAdmin = route.data?.['requiresAdmin'] === true;
    return this.checkAuth(requiresAdmin);
  }

  private checkAuth(requiresAdmin: boolean): Observable<boolean> | boolean {
    // Si no está autenticado, redirigir al login
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Debes iniciar sesión para acceder', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Si requiere admin, verificar rol primero
    if (requiresAdmin) {
      // Si ya tenemos el rol en memoria y es admin, permitir acceso
      if (this.authService.isAdmin()) {
        return true;
      }

      // Si tenemos el rol pero no es admin, denegar acceso
      if (this.authService.getCurrentUser()) {
        this.snackBar.open('No tienes permisos para acceder a esta sección', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/portfolio/home']);
        return false;
      }

      // Si no tenemos el rol aún, verificar token
      return this.authService.verifyToken().pipe(
        switchMap(result => {
          if (result.valid && result.role === 1) {
            return of(true);
          } else {
            this.snackBar.open('No tienes permisos para acceder a esta sección', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/portfolio/home']);
            return of(false);
          }
        }),
        catchError(() => {
          this.snackBar.open('Error al verificar permisos', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/auth/login']);
          return of(false);
        })
      );
    }

    // Si no requiere admin, permitir acceso
    return true;
  }
}
