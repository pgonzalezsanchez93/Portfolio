import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { LoginData, VerifyResponse } from '../../interfaces/user.interface';

@Component({
  selector: 'auth-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class AuthLoginPageComponent implements OnInit {
   hidePassword = true;
  isLoading = false;
  isAdmin = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/portfolio/home']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const loginData: LoginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      isAdmin: this.isAdmin
    };


    this.authService.login(loginData).subscribe({
      next: (loginResponse) => {
        this.snackBar.open('Credenciales validadas, verificando token...', 'Cerrar', {
          duration: 2000
        });


        this.verifyAndRedirect();
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Error al iniciar sesión', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }


  verifyAndRedirect(): void {
    this.authService.verifyToken().subscribe({
      next: (result) => {
        this.isLoading = false;

        if (result.valid) {
          const roleText = result.role === 1 ? 'Administrador' : 'Usuario';
          this.snackBar.open(`Bienvenido ${result.userName || ''}. Rol: ${roleText}`, 'Cerrar', {
            duration: 3000
          });


          this.authService.redirectByRole();
        } else {
          this.snackBar.open('Token inválido', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error al verificar token: ' + error.message, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  toggleAdminMode(): void {
    this.isAdmin = !this.isAdmin;
  }

  isValidField(field: string): boolean | null {
    return this.loginForm.controls[field].errors &&
           this.loginForm.controls[field].touched;
  }

  getFieldError(field: string): string | null {
    if (!this.loginForm.controls[field]) return null;

    const errors = this.loginForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'email':
          return 'Formato de correo inválido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }
}
