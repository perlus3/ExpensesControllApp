import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CashFlowEntity } from './cash-flow.entity';
import { OperationType } from '../../types';

@Entity()
export class CategoriesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true,
  })
  name: string;
  @OneToMany(() => CashFlowEntity, (operation) => operation.category)
  operations: CashFlowEntity[];

  @Column({
    type: 'enum',
    enum: OperationType,
  })
  type: OperationType;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
