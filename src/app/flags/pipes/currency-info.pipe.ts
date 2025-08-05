import { Pipe, PipeTransform } from '@angular/core';


// Con este pipe recorro y muestro las monedas oficiales y sus simbolos
@Pipe({
  name: 'currencyInfo'
})

export class CurrencyInfoPipe implements PipeTransform {
  transform(currencies: any): string {
    if (!currencies) return 'No disponible';

    return Object.values(currencies)
      .map((currency: any) => `${currency.name} (${currency.symbol || ''})`)
      .join(', ');
  }
}
