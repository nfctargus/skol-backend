import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { CreatePrivateMessageResponse, PrivateMessageEventParams } from "utils/types";
import { Socket,Server } from 'socket.io';
import { OnEvent } from "@nestjs/event-emitter";
import { Inject, Logger } from "@nestjs/common";
import { AuthenticatedSocket, ISessionStore } from "utils/interfaces";
import { PrivateMessage } from "utils/typeorm";
import { Services } from "utils/contants";
import { IUserService } from "src/users/user";
@WebSocketGateway({cors: {origin: ['http://localhost:3000'],credentials: true}})
export class EventsGateway implements OnGatewayConnection,OnGatewayDisconnect  {

    constructor(@Inject(Services.GATEWAY_SESSION_STORE) private readonly sessions:ISessionStore,
                @Inject(Services.USER) private readonly userService:IUserService) {}
    
    @WebSocketServer() server: Server = new Server();
    private logger = new Logger('ChatGateway');

    async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
        this.server.use((socket:AuthenticatedSocket, next) => {
            const user = socket.handshake.auth.user;
            if (!user) {
              return next(new Error("invalid username"));
            }
            socket.user = user;
            next();
        });

        if(client.user) {
            client.join(`private-chat-${client.user.id}`)
            this.sessions.saveSession(client.user.id,client);

            /* this.server.on("connection", (client:AuthenticatedSocket) => {
                client.broadcast.emit("userConnected", {
                    user:client.user
                });
            }); */
        }
        
        
    }
    handleDisconnect(client: AuthenticatedSocket) {
        if(client.user) this.sessions.deleteSession(client.user.id)
    }  
    @SubscribeMessage('newPrivateMessage')
    async privateMessage(@MessageBody() {message,chat,recipientId}:PrivateMessageEventParams) {
        this.server.to(`private-chat-${recipientId}`).emit('messageReceived', {message,chat}); 
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