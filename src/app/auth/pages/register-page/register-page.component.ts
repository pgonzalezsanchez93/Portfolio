import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../interfaces/user.interface';

@Component({
  selector: 'auth-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class AuthRegisterPageComponent implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;


  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordsMatchValidator
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/portfolio/home']);
    }
  }


  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }

    return null;
  }


  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const registerData: RegisterData = this.registerForm.value;


    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(response.message || 'Registration successful. All new users are registered with a user token.', 'Close', {
          duration: 5000
        });


        this.verifyTokenAndRedirect();
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Registration failed', 'Close', {
          duration: 3000
        });
      }
    });
  }

  private verifyTokenAndRedirect(): void {
    this.authService.verifyToken().subscribe({
      next: (result) => {
        if (result.valid) {
          const roleText = result.role === 1 ? 'Administrator' : 'User';
          this.snackBar.open(`Token verified. You have ${roleText} privileges.`, 'Close', {
            duration: 3000
          });
          this.router.navigate(['/portfolio/home']);
        } else {
          this.snackBar.open('Token verification failed', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/auth/login']);
        }
      },
      error: (error) => {
        this.snackBar.open('Error verifying token: ' + error.message, 'Close', {
          duration: 5000
        });
        this.router.navigate(['/auth/login']);
      }
    });
  }

  isValidField(field: string): boolean | null {
    return this.registerForm.controls[field].errors &&
           this.registerForm.controls[field].touched;
  }


  getFieldError(field: string): string | null {
    if (!this.registerForm.controls[field]) return null;

    const errors = this.registerForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'email':
          return 'Invalid email format';
        case 'minlength':
          return `Minimum ${errors['minlength'].requiredLength} characters`;
        case 'passwordMismatch':
          return 'Passwords do not match';
      }
    }

    return null;
  }
}
