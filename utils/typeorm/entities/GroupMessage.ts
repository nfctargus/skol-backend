import { Entity, ManyToOne } from "typeorm";
import { Message } from "./Message";
import { GroupChat } from "./GroupChat";

@Entity({name: 'group-messages'})
export class GroupMessage extends Message {
    @ManyToOne(() => GroupChat, (groupChat) => groupChat.messages)
    groupChat:GroupChat;
}