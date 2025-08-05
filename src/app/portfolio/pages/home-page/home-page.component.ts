import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../interfaces/project.interface';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';
import { AuthService } from '../../../auth/services/auth.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

const fadeInUpAnimation = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

const staggerAnimation = trigger('staggerList', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [fadeInUpAnimation, staggerAnimation]
})
export class HomePageComponent implements OnInit {

  @ViewChild('projectsSection') projectsSection!: ElementRef;
  @ViewChild('contactSection') contactSection!: ElementRef;

  projects: Project[] = [
        {
      title: 'Cozy App',
      description: 'Aplicación gestora de tareas y con implementación del método POMODORO.',
      image: 'assets/img/cozyapplogin.PNG',
      route: 'https://cozyapp.netlify.app',
      isExternal: true,
      technologies: ['Angular', 'NestJS', 'Material']
    },
    {
      title: 'ToDo List App',
      description: 'Aplicación de gestión de tareas con calendario integrado y organización por listas.',
      image: 'assets/img/to-do-list-app.jpg',
      route: 'to-do-list',
      technologies: ['Angular', 'Material', 'FullCalendar']
    },
    {
      title: 'Weather App',
      description: 'Consulta el clima en tiempo real de cualquier ciudad con datos meteorológicos detallados.',
      image: 'assets/img/dark-weather.jpg',
      route: 'weather',
      isExternal: false,
      technologies: ['Angular', 'OpenWeather API', 'Material']
    },
    {
      title: 'Banderas App',
      description: 'Explorador interactivo de países con información detallada y visualización de banderas.',
      image: 'assets/img/dark-flags.jpg',
      route: 'flags',
      isExternal: false,
      technologies: ['Angular', 'REST Countries API', 'Material']
    },
    //{
     // title: 'Catálogo',
     // description: 'Explora nuestro catálogo de productos',
     // image: 'assets/img/dark-flags.jpg',
     // route: 'catalogue',
    //  isExternal: false,
    //  technologies: ['Angular', 'FakeStoreApi', 'Material']
   // },
    {
      title: 'Towns App',
      description: 'Mapa interactivo de poblaciones de España con búsqueda y visualización geográfica.',
      image: 'assets/img/towns.jpg',
      route: 'towns',
      isExternal: false,
      technologies: ['Angular', 'Mapbox', 'OpenDataSoft API', 'Material']
    }
  ];


  skillCategories = [
    {
      title: 'Frontend',
      icon: 'code',
      color: 'primary',
      skills: [
        { name: 'Angular', level: 90 },
        { name: 'HTML/CSS', level: 95 },
        { name: 'JavaScript/TypeScript', level: 85 }
      ]
    },
    {
      title: 'Diseño UI',
      icon: 'brush',
      color: 'accent',
      skills: [
        { name: 'Angular Material', level: 90 },
        { name: 'Bootstrap', level: 85 },
        { name: 'Diseño Responsivo', level: 90 }
      ]
    },
    {
      title: 'Herramientas',
      icon: 'integration_instructions',
      color: 'warn',
      skills: [
        { name: 'Git/GitHub', level: 80 },
        { name: 'REST APIs', level: 85 },
        { name: 'Mapbox/APIs Externas', level: 75 }
      ]
    }
  ];


  statistics = [
    { value: '4+', label: 'Proyectos' },
    { value: '10+', label: 'Tecnologías' },
    { value: '500+', label: 'Horas de código' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const isAuthenticated = this.authService.isAuthenticated();
    console.log('User authenticated:', isAuthenticated);

  }

   onProjectSelected(route: string): void {
    if (route.startsWith('http')) {
      window.open(route, '_blank', 'noopener,noreferrer');
    } else {
      this.router.navigate([route]);
    }
  }



  scrollToProjects() {
    this.projectsSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

    scrollToLinks() {
    this.contactSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }
}
