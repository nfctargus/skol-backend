import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrivateMessageEventParams } from "utils/types";
import { Socket,Server } from 'socket.io';
import { Inject, Logger } from "@nestjs/common";
import { AuthenticatedSocket, ISessionStore } from "utils/interfaces";
import { Services } from "utils/contants";
import { IChatsService } from "src/chats/chats";
@WebSocketGateway({cors: {origin: ['http://localhost:3000'],credentials: true}})
export class EventsGateway implements OnGatewayConnection,OnGatewayDisconnect  {

    constructor(@Inject(Services.GATEWAY_SESSION_STORE) private readonly sessions:ISessionStore,
                @Inject(Services.CHAT) private readonly chatService:IChatsService) {}
    
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
    async privateMessageEvent(@MessageBody() {message,chat,recipientId}:PrivateMessageEventParams) {
        this.server.to(`private-chat-${recipientId}`).emit('messageReceived', {message,chat}); 
    }
    @SubscribeMessage('privateMessageDeleted')
    async privateMessageDeletedEvent(@MessageBody() {messageId,chatId,userId}) {
        const chat = await this.chatService.getChatById(chatId);
        const recipient = chat.recipient.id === userId ? chat.creator : chat.recipient
        console.log(recipient)
        this.server.to(`private-chat-${recipient.id}`).emit('messageDeleted', {messageId}); 
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