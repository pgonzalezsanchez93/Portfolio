export interface Country {
  name: {
    common: string;
    official: string;
  };
  ccn3: string,
  capital: string[];//Capital como selector, añaidr, (PAIS), PARA QUE NO HAYA EQUIVOCACIONES
  population: number;
  flags: {
    svg: string;
    alt: string;
  };
  currencies: {[key: string]: {name: string; symbol: string}};
  languages: {[key: string]: string};
  translations: {
    spa: {
      common: string;
      official: string;
    }
  };
}
