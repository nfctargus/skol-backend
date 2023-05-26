import { Entity, ManyToOne } from "typeorm";
import { Message } from "./Message";
import { Chat } from "./Chat";

@Entity({name: 'private-messages'})
export class PrivateMessage extends Message {
    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat:Chat;
}