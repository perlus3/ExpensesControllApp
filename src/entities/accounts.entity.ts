import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AccountsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    user: string;

    @Column()
    value: number;
}
