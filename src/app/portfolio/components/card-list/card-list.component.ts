
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Project } from '../../interfaces/project.interface';


const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

const staggerListAnimation = trigger('staggerList', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

@Component({
  selector: 'home-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
  animations: [fadeInAnimation, staggerListAnimation]
})
export class CardListComponent {
  @Input() projects: Project[] = [];

  @Output() projectSelected = new EventEmitter<string>();

  selectProject(route: string): void {
    this.projectSelected.emit(route);
  }

  getAllTechnologies(): string[] {
    const technologies = new Set<string>();

    this.projects.forEach((project: Project) => {
      if (project.technologies) {
        project.technologies.forEach((tech: string) => technologies.add(tech));
      }
    });

    return Array.from(technologies);
  }
}
