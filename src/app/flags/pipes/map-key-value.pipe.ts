import { Pipe, PipeTransform } from '@angular/core';

//Con este pipe recorro y hago que se muestren todos los idiomas oficiales.
@Pipe({
  name: 'mapKeyValue'
})

export class MapKeyValuePipe implements PipeTransform {

  transform(value: {[key: string]: string } | undefined): string {
      return value ? Object.values(value).join(', '): 'No disponible';
  }
}
