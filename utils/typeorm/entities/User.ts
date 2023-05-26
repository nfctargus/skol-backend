import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrivateMessage } from "./PrivateMessage";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique: true})
    email:string;

    @Column()
    username:string;

    @Column()
    firstName:string;

    @Column()
    lastName:string;   

    @Column()
    @Exclude()
    password:string;

    @OneToMany(() => PrivateMessage, (message) => message.author)
    @JoinColumn()
    messages:PrivateMessage[];
}