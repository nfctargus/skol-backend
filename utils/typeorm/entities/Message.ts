import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export abstract class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    messageContent:string;

    @CreateDateColumn({name: 'created_at'})
    createdAt:number;

    @ManyToOne(() => User, (user) => user.email)
    author:User;
}