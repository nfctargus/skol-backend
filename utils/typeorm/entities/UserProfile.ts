import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({name:'user-profiles'})
export class UserProfile {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable: true})
    avatar?:string;

    @OneToOne(() => User,(user) => user.profile)
    user:User;
}