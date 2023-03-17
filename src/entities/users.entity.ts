import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountsEntity } from './accounts.entity';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => AccountsEntity, (accounts) => accounts.user)
  accounts: AccountsEntity[];

  @Column({ default: true })
  isActive: boolean;

  @Column({
    select: false,
  })
  password?: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  getUser(): UsersEntity {
    const { password, ...user } = this;

    return user as unknown as Omit<UsersEntity, 'getUser()'>;
  }
}
