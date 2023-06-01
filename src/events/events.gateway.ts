import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { CreatePrivateMessageResponse } from "utils/types";
import { Socket } from 'socket.io';

@WebSocketGateway({cors: {origin: ['http://localhost:3000'],credentials: true}})
export class Gateway {
    
    @SubscribeMessage('privateMessages-create')
    handlePrivateMessageCreateEvent(client: Socket,@MessageBody() data: CreatePrivateMessageResponse){
        console.log('privateMessages-create')
        client.emit('newPrivateMessage',data);
    }

}