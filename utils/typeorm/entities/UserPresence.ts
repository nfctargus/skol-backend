import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({name:'user-presence'})
export class UserPresence {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable: true,default:"Offline"})
    userPresence:string;

    @OneToOne(() => User,(user) => user.presence)
    @JoinColumn()
    user:User;
}