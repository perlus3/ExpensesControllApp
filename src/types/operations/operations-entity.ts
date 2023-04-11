export enum OperationType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

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
