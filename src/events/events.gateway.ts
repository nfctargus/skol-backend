import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { CreatePrivateMessageResponse } from "utils/types";
import { Socket,Server } from 'socket.io';
import { OnEvent } from "@nestjs/event-emitter";
import { Inject, Logger } from "@nestjs/common";
import { ISessionStore } from "utils/interfaces";
import { PrivateMessage } from "utils/typeorm";
import { Services } from "utils/contants";
@WebSocketGateway({cors: {origin: ['http://localhost:3000'],credentials: true}})
export class EventsGateway implements OnGatewayConnection,OnGatewayDisconnect  {

    constructor(@Inject(Services.GATEWAY_SESSION_STORE) private readonly sessions:ISessionStore) {}
    
    @WebSocketServer() server: Server = new Server();
    private logger = new Logger('ChatGateway');

    async handleConnection(client: Socket, ...args: any[]) {
        this.sessions.saveSession(client.id,client);
        
    }
    handleDisconnect(client: Socket) {
        this.sessions.deleteSession(client.id)
    }  
    
    @OnEvent('newPrivateMessage')
    async handlePrivateMessageEvent(@MessageBody() payload: PrivateMessage) {
        //this.logger.log(payload);
        const {chat} = payload;
        this.server.to(`chat-${chat.id}`).emit('newPrivateMessage', payload)
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