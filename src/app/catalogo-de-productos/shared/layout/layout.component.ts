import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(
    private router: Router,

   ){}
}
