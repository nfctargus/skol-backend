import { IsEmail, IsNotEmpty } from "class-validator";

export class FindOrCreateChat {
    @IsEmail()
    @IsNotEmpty()
    email:string;
}