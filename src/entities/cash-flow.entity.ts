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
import { CategoriesEntity } from './categories.entity';
import { OperationType } from 'types/operations/operations-entity';
@Entity()
export class CashFlowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
  })
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

  @ManyToOne(() => CategoriesEntity, (category) => category.name, {
    onDelete: 'CASCADE',
  })
  category: CategoriesEntity;

  @Column({
    type: 'enum',
    enum: OperationType,
  })
  operationType: OperationType;
}
