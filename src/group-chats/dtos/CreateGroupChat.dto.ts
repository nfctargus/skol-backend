import { ArrayNotEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateGroupChatDto {
    @IsString()
    name:string;

    @IsString({ each: true })
    @ArrayNotEmpty()
    members: string[];

    @IsString()
    @IsNotEmpty()
    message:string;
}