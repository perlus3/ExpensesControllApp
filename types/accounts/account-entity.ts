export enum Currency {
  PLN = 'PLN',
  EURO = 'EURO',
  DOLAR = 'DOLAR',
}

export interface NewAccountEntity {
  id: string;
  name: string;
  value: number;
  currency: Currency;
}
