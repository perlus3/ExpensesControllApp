import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { AccountsEntity } from './accounts.entity';

export enum OperationType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

@Entity()
export class CashFlowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

  @Column()
  value: number;

  @Column()
  description?: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: UsersEntity;

  @ManyToOne(() => AccountsEntity, (byUserAccount) => byUserAccount.id, {
    onDelete: 'CASCADE',
  })
  byUserAccount: AccountsEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  operationType: OperationType;
}
