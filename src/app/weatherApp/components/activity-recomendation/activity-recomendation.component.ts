import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-activity-recomendation',
  templateUrl: './activity-recomendation.component.html'
})
export class ActivityRecomendationComponent {

    //
  @Input()
    set weatherCondition(condition: string) {
      this.recommendation = this.getRecommendation(condition);
  }

  recommendation: string = '';

  //Extrae la recomendación según el clima,
  private getRecommendation(condition: string): string {
    const lowercaseCondition = condition.toLowerCase();


    if (lowercaseCondition.includes('claro')) {
       return 'Podrías hacer un picnic.';
    }
    if (lowercaseCondition.includes('lluvia')) {
       return 'Día de peli y manta.';
    }
    if (lowercaseCondition.includes('nubes')) {
       return 'Perfecto para salir a correr.';
    }
    if (lowercaseCondition.includes('nuboso')) {
      return 'Siempre puedes ir al centro comercial';
   }
     return 'Antes de salir de casa es conveniente mirar el tiempo';
  }


}
