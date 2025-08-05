
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';


@Component({
  selector: 'shared-theme-switcher',
  templateUrl: './theme-switcher.component.html'
})
export class ThemeSwitcherComponent {

  // Inicializamos con el dark-mode en false

  isDarkThemeActive = false;

  //Injecta el document
  constructor(@Inject(DOCUMENT) private document: Document) {}


  //dependiendo del valor del slide-toogle añadira o quitara el dark-mode de la clase de body
  onChange(newValue: boolean):void {
    console.log(newValue);
    if (newValue) {
      this.document.body.classList.add('dark-mode');
    }else{
      this.document.body.classList.remove('dark-mode');
    }
  }



}
