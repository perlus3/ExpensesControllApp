import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperationType } from '../../types';

@Entity()
export class CategoriesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true,
  })
  name: string;

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
