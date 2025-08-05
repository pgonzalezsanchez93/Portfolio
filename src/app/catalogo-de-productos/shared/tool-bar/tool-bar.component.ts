import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'shared-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})
export class ToolBarComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;


 /*  public sidebarItems: MenuItem[] = [

  ];*/
}
