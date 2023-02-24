import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    accounts: string;

    @Column({
        select: false,
    })
    password?: string;
}
