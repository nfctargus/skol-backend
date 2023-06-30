import { IsNotEmpty, IsString } from "class-validator";

export class EditUserPresenceDto {
    @IsString()
    @IsNotEmpty()
    presence:string;
}