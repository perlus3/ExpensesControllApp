export enum OperationType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

//@Todo czy jeżeli mam tu typy to powinienem tez nimi zastapić wszystkie typy na backendzie np dto i entity?

export interface SingleOperationEntity {
  id: string;
  name: string;
  value: number;
  date: Date;
  operationType: OperationType;
}

export interface NewOperationData {
  id: string;
  name: string;
  value: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  operationType: OperationType;
}
