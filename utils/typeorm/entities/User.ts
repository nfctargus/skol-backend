import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrivateMessage } from "./PrivateMessage";
import { GroupChat } from "./GroupChat";

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

    @ManyToMany(() => GroupChat,(groupChat) => groupChat.members)
    groupChats:GroupChat[];
}