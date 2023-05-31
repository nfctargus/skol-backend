import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateChatDto {
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    message:string;
}