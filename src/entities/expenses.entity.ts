import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExpensesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @Column()
    value: string;
    @Column()
    description: string;
    @Column()
    user: string;
    @Column()
    paidBy: string;
    @CreateDateColumn()
    when: string;
}
