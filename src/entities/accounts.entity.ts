import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { Currency } from '../../types';

@Entity()
export class AccountsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: UsersEntity;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
  })
  value: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.PLN,
  })
  currency: Currency;
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
