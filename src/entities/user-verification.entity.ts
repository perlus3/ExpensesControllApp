import { UsersEntity } from './users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserVerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UsersEntity | string;

  @CreateDateColumn()
  createdAt: Date;
  @Column()
  expiresAt: Date;
  @Column({
    default: false,
  })
  verified: boolean;
}
