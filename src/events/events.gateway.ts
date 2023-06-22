import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { CreatePrivateMessageResponse } from "utils/types";
import { Socket,Server } from 'socket.io';
import { OnEvent } from "@nestjs/event-emitter";
import { Logger } from "@nestjs/common";
import { UserSocket } from "utils/interfaces";
import { PrivateMessage } from "utils/typeorm";

@WebSocketGateway({cors: {origin: ['http://localhost:3000'],credentials: true}})
export class EventsGateway implements OnGatewayConnection,OnGatewayDisconnect  {

    @WebSocketServer() server: Server = new Server();
    private logger = new Logger('ChatGateway');

    handleConnection(client: Socket, ...args: any[]) {
    }
    handleDisconnect(client: Socket) {

    }  

    @OnEvent('newPrivateMessage')
    async handleEvent(@MessageBody() payload: PrivateMessage,@ConnectedSocket() client:Socket) {
        //this.logger.log(payload);
        const {chat} = payload;
        //this.server.emit('chat', payload); // broadcast messages
        this.server.to(`chat-${chat.id}`).emit('newPrivateMessage', payload)
        //client.to(`chat-${chat.id}`).emit('newPrivateMessage', payload)
        console.log(client)
    }

    @SubscribeMessage('newChatConnection')
    onClientConnect(@MessageBody() data:any, @ConnectedSocket() client:Socket) {
        
        const { id } = data;
        client.join(`chat-${id}`);
        //client.join(`conversation-${data.conversationId}`);
        console.log("Connected to Rooms: ")
        console.log(client.rooms);
        //client.to(`conversation-${data.conversationId}`).emit('userJoin');
    }
    @SubscribeMessage('newChatDisconnect')
    onClientDisconnect(@MessageBody() data:any, @ConnectedSocket() client:Socket) {
        const { id } = data;
        client.leave(`chat-${id}`);
        console.log("Disconnected")
        console.log(client.rooms);
    }
}