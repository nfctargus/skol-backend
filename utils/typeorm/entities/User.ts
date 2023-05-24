import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id:string;

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
}