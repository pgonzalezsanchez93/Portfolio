import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

@Component({
  selector: 'shared-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isLoggedIn = false;
  userName = '';

  // Lista completa de items del menú
  public sidebarItems: MenuItem[] = [
    { label: 'Home', icon: 'home', route: '/' },
    { label: 'Weather App', icon: 'cloud', route: './weather' },
    { label: 'Fun with Flags', icon: 'flag', route: './flags' },
    { label: 'Towns App', icon: 'location_city', route: './towns', requiresAuth: true, requiresAdmin: true },
    { label: 'To Do List App', icon: 'receipt_long', route: './to-do-list', requiresAuth: true },
    { label: 'Catalogo', icon: 'shop', route: './catalogue', requiresAuth: true },
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el estado de autenticación
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      const currentUser = this.authService.getCurrentUser();
      this.userName = currentUser ? currentUser.name : '';
    });
  }

  // Método para filtrar elementos del menú según el estado de autenticación
  get visibleMenuItems(): MenuItem[] {
    return this.sidebarItems.filter(item => {
      // Si requiere admin, verificar que el usuario sea admin
      if (item.requiresAdmin) {
        return this.isLoggedIn && this.authService.isAdmin();
      }

      // Si solo requiere autenticación, verificar que esté autenticado
      if (item.requiresAuth) {
        return this.isLoggedIn;
      }

      // Si no tiene requisitos, mostrar siempre
      return true;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    if (this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }

  login(): void {
    this.router.navigate(['/auth/login']);
    if (this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }
}
