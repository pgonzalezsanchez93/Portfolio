import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'shared-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {


    constructor( private router: Router ) {}


}
