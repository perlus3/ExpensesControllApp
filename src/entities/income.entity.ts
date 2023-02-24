import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class IncomeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    value: number;
    @Column()
    title: string;
    @Column()
    incomeForWhat: string;

    @CreateDateColumn()
    createdAt: string;

    @Column()
    user: string;

    @Column()
    description: string;

}
