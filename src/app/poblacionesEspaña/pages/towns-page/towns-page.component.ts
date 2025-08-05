
import { Component, OnInit } from '@angular/core';
import { TownsService } from '../../services/towns.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-towns-page',
  templateUrl: './towns-page.component.html',
  styleUrls: ['./towns-page.component.css']
})
export class TownsPageComponent  implements OnInit{
  userName: string = '';

  constructor(
    private townsService: TownsService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Verificar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Debe iniciar sesión para acceder a esta página', 'Cerrar', {
        duration: 3000
      });
      this.router.navigate(['/auth/login']);
      return;
    }

    // Verificar que el usuario tenga rol de administrador
    if (!this.authService.isAdmin()) {
      this.snackBar.open('No tiene permisos para acceder a esta página', 'Cerrar', {
        duration: 3000
      });
      this.router.navigate(['/portfolio/home']);
      return;
    }

    // Obtener información del usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.name;
    }

    // Verificar el token para confirmar el rol
    this.verifyToken();
  }

  verifyToken(): void {
    this.authService.verifyToken().subscribe({
      next: (result) => {
        if (result.valid && result.role === 1) {
          this.userName = result.userName || this.userName;
        } else {
          this.snackBar.open('No tiene permisos de administrador', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/portfolio/home']);
        }
      },
      error: (error) => {
        this.snackBar.open('Error al verificar el token: ' + error.message, 'Cerrar', {
          duration: 5000
        });
        this.router.navigate(['/auth/login']);
      }
    });
  }
}


