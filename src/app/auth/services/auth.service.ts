import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { User, AuthResponse, LoginData, RegisterData, VerifyResponse, TokenResponse, VerifyTokenResponse } from '../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private readonly USER_KEY = 'auth_user';
    private readonly TOKEN_KEY = 'auth_token';
    private readonly ROLE_KEY = 'auth_role';
    private readonly USERS_KEY = 'registered_users';

    // API base URL
    private readonly BASE_URL = 'https://8rkrz.wiremockapi.cloud';

    // Token constante para admin
    private readonly ADMIN_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2wiOiIxIiwibmFtZSI6Ikp1YW4gUGVycmUiLCJpZF91c2VyIjoxMjMsImV4cCI6MTYyNTk3NTk5fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';


    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private currentTokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
    public currentToken$ = this.currentTokenSubject.asObservable();

    private currentRoleSubject = new BehaviorSubject<number | null>(this.getStoredRole());
    public currentRole$ = this.currentRoleSubject.asObservable();

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.getStoredToken() !== null);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private router: Router
    ) {

      this.checkAuthStatus();

    }


    private checkAuthStatus(): void {
      const user = this.getUserFromStorage();
      const token = this.getStoredToken();
      const role = this.getStoredRole();

      if (user && token) {
        this.currentUserSubject.next(user);
        this.currentTokenSubject.next(token);
        this.currentRoleSubject.next(role);
        this.isLoggedInSubject.next(true);
      } else {
        this.clearAuthState();
      }
    }


    private clearAuthState(): void {
      this.currentUserSubject.next(null);
      this.currentTokenSubject.next(null);
      this.currentRoleSubject.next(null);
      this.isLoggedInSubject.next(false);
    }


    private getUserFromStorage(): User | null {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (!userStr) return null;

      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from storage', error);
        return null;
      }
    }


    private saveUsersToStorage(users: User[]): void {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }


    private getUsersFromStorage(): User[] {
      const usersStr = localStorage.getItem(this.USERS_KEY);
      if (!usersStr) return [];

      try {
        return JSON.parse(usersStr);
      } catch (error) {
        console.error('Error parsing users from storage', error);
        return [];
      }
    }


    private getStoredToken(): string | null {
      return localStorage.getItem(this.TOKEN_KEY);
    }

    private getStoredRole(): number | null {
      const role = localStorage.getItem(this.ROLE_KEY);
      return role ? parseInt(role, 10) : null;
    }

    private setToken(token: string): void {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.currentTokenSubject.next(token);
    }

    private setRole(role: number): void {
      localStorage.setItem(this.ROLE_KEY, role.toString());
      this.currentRoleSubject.next(role);
    }

    private setUser(user: User): void {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    }

    register(userData: RegisterData): Observable<AuthResponse> {
      this.isLoadingSubject.next(true);


      if (userData.password !== userData.confirmPassword) {
        this.isLoadingSubject.next(false);
        return throwError(() => new Error('Las contraseñas no coinciden'));
      }

      const users = this.getUsersFromStorage();


      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        this.isLoadingSubject.next(false);
        return throwError(() => new Error('El correo electrónico ya está registrado'));
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password
      };


      return this.getTokenUser().pipe(
        map(response => {
          const token = response.result.token;

          newUser.token = token;


          users.push(newUser);
          this.saveUsersToStorage(users);

          this.setToken(token);

          const userToStore = { ...newUser, password: undefined };
          this.setUser(userToStore);


          this.isLoggedInSubject.next(true);

          const authResponse: AuthResponse = {
            user: userToStore,
            token: token,
            success: true,
            message: 'Registro exitoso'
          };

          this.isLoadingSubject.next(false);
          return authResponse;
        }),
        catchError(error => {
          this.isLoadingSubject.next(false);
          return throwError(() => new Error('Error al obtener token de usuario: ' + this.getErrorMessage(error)));
        })
      );
    }

    login(loginData: LoginData): Observable<AuthResponse> {
      this.isLoadingSubject.next(true);

      // Verificar credenciales contra usuarios locales
      const users = this.getUsersFromStorage();
      const user = users.find(u =>
        u.email === loginData.email &&
        u.password === loginData.password
      );

      // Si el usuario no existe o las credenciales son incorrectas
      if (!user) {
        this.isLoadingSubject.next(false);
        return throwError(() => new Error('Credenciales incorrectas'));
      }

      // Si el usuario ya tiene un token almacenado, lo usamos directamente
      if (user.token) {
        // Establecer el token para la sesión actual
        this.setToken(user.token);

        // Establecer el usuario actual (sin contraseña)
        const userToStore = { ...user, password: undefined };
        this.setUser(userToStore);

        // Marcar como autenticado
        this.isLoggedInSubject.next(true);

        // Preparar respuesta
        const authResponse: AuthResponse = {
          user: userToStore,
          token: user.token,
          success: true,
          message: 'Inicio de sesión exitoso'
        };

        this.isLoadingSubject.next(false);
        return new Observable(observer => {
          observer.next(authResponse);
          observer.complete();
        });
      }

      // Si el usuario no tiene token, obtenemos uno nuevo según el tipo de login
      const tokenCall = loginData.isAdmin
        ? this.getAdminToken()
        : this.getTokenUser();

      return tokenCall.pipe(
        map(response => {
          const token = response.result.token;

          // Actualizar el usuario con el nuevo token
          user.token = token;

          // Actualizar usuario en el almacenamiento
          const userIndex = users.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            users[userIndex] = user;
            this.saveUsersToStorage(users);
          }

          // Establecer token para la sesión actual
          this.setToken(token);

          // Establecer usuario actual (sin contraseña)
          const userToStore = { ...user, password: undefined };
          this.setUser(userToStore);

          // Marcar como autenticado
          this.isLoggedInSubject.next(true);

          // Preparar respuesta
          const authResponse: AuthResponse = {
            user: userToStore,
            token: token,
            success: true,
            message: 'Inicio de sesión exitoso'
          };

          this.isLoadingSubject.next(false);
          return authResponse;
        }),
        catchError(error => {
          this.isLoadingSubject.next(false);
          return throwError(() => new Error('Error al iniciar sesión: ' + this.getErrorMessage(error)));
        })
      );
    }

    private getTokenUser(): Observable<TokenResponse> {
      this.isLoadingSubject.next(true);
      return this.http.get<TokenResponse>(`${this.BASE_URL}/getTokenUser`).pipe(
        tap(response => {
          console.log('User token retrieved:', response);
        }),
        catchError(error => {
          console.error('Error getting user token:', error);
          return throwError(() => new Error('Error al obtener token de usuario: ' + this.getErrorMessage(error)));
        }),
        finalize(() => {
          this.isLoadingSubject.next(false);
        })
      );
    }


    private getAdminToken(): Observable<TokenResponse> {
      this.isLoadingSubject.next(true);
      return this.http.get<TokenResponse>(`${this.BASE_URL}/getTokenAdmin`).pipe(
        tap(response => {
          console.log('Admin token retrieved:', response);
        }),
        catchError(error => {
          console.error('Error getting admin token:', error);
          return throwError(() => new Error('Error al obtener token de administrador: ' + this.getErrorMessage(error)));
        }),
        finalize(() => {
          this.isLoadingSubject.next(false);
        })
      );
    }

    verifyToken(): Observable<VerifyResponse> {
      this.isLoadingSubject.next(true);

      const token = this.getStoredToken();

      if (!token) {
        this.isLoadingSubject.next(false);
        return throwError(() => new Error('No hay token para verificar'));
      }

      // El interceptor JWT añadirá automáticamente el token en la cabecera
      return this.http.get<VerifyTokenResponse>(`${this.BASE_URL}/verifyToken`).pipe(
        map(response => {
          // Obtener el rol desde la respuesta
          const role = response.result.userLogin.rol;

          // Guardar el rol en localStorage y en el observable
          this.setRole(role);

          // Actualizar información del usuario actual si es necesario
          const currentUser = this.currentUserSubject.value;
          if (currentUser) {
            const updatedUser: User = {
              ...currentUser,
              name: response.result.userLogin.name,
              id_user: response.result.userLogin.id_user
            };

            // Actualizar usuario en sesión
            this.setUser(updatedUser);

            // Actualizar usuario en la lista de usuarios almacenados
            const users = this.getUsersFromStorage();
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
              users[userIndex] = {
                ...users[userIndex],
                name: response.result.userLogin.name,
                id_user: response.result.userLogin.id_user,
                // Mantener la contraseña
                password: users[userIndex].password
              };
              this.saveUsersToStorage(users);
            }
          }

          // Respuesta simplificada para el frontend
          const result: VerifyResponse = {
            role: role,
            valid: true,
            userName: response.result.userLogin.name,
            userId: response.result.userLogin.id_user
          };

          this.isLoadingSubject.next(false);
          return result;
        }),
        catchError(error => {
          console.error('Error al verificar el token:', error);

          // Limpiar estado de autenticación en caso de error
          this.clearAuthState();

          // Propagar el error
          this.isLoadingSubject.next(false);
          return throwError(() => new Error('Error al verificar el token: ' + this.getErrorMessage(error)));
        })
      );
    }

    logout(): void {

      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ROLE_KEY);

      this.clearAuthState();

      this.router.navigate(['/auth/login']);

      this.snackBar.open('Sesión cerrada correctamente', 'Cerrar', {
        duration: 3000
      });
    }


    isAuthenticated(): boolean {
      return this.isLoggedInSubject.value;
    }

    isAdmin(): boolean {
      return this.currentRoleSubject.value === 1;
    }

    isUser(): boolean {
      return this.currentRoleSubject.value === 2;
    }

    getCurrentUser(): User | null {
      return this.currentUserSubject.value;
    }

    getToken(): string | null {
      return this.currentTokenSubject.value;
    }

    private getErrorMessage(error: HttpErrorResponse | any): string {
      let errorMessage = 'Se produjo un error desconocido';

      if (error.error instanceof ErrorEvent) {

        errorMessage = `Error: ${error.error.message}`;
      } else if (error.status) {

        switch (error.status) {
          case 0:
            errorMessage = 'No se pudo conectar con el servidor. Compruebe su conexión a internet.';
            break;
          case 401:
            errorMessage = 'No autorizado. Las credenciales proporcionadas no son válidas.';
            break;
          case 403:
            errorMessage = 'Acceso prohibido. No tiene permisos para acceder a este recurso.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Inténtelo de nuevo más tarde.';
            break;
          default:
            errorMessage = `Error HTTP: ${error.status} - ${error.statusText || 'Error desconocido'}`;
        }
      } else {

        errorMessage = error.message || 'Error desconocido';
      }

      return errorMessage;
    }

    redirectByRole(): void {
      const role = this.currentRoleSubject.value;


      this.router.navigate(['/portfolio/home']);
    }
  }
