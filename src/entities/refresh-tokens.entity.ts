import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('refresh_tokens')
export class RefreshTokensEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 350,
    nullable: false,
    unique: true,
  })
  refreshToken!: string;
  @Column({
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  expiresIn!: Date;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  user?: UsersEntity;
}
