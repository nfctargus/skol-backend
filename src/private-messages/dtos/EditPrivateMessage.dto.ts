import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditPrivateMessageDto {
    @IsNumber()
    @IsNotEmpty()
    id:number;

    @IsString()
    @IsNotEmpty()
    messageContent:string
}