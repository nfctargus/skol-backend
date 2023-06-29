import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { CreateGroupMessageResponse, DeleteMessageEventParams, EditGroupChatMemberEventParams, EditMessageEventParams, NewPrivateMessageEventParams } from "utils/types";
import { Server } from 'socket.io';
import { Inject, Logger } from "@nestjs/common";
import { AuthenticatedSocket, ISessionStore } from "utils/interfaces";
import { Services } from "utils/contants";
import { IChatsService } from "src/chats/chats";
import { IGroupChatsService } from "src/group-chats/group-chats";
import { IUserService } from "src/users/user";
@WebSocketGateway({cors: {origin: ['http://localhost:3000'],credentials: true}})
export class EventsGateway implements OnGatewayConnection,OnGatewayDisconnect  {

    constructor(@Inject(Services.GATEWAY_SESSION_STORE) private readonly sessions:ISessionStore,
                @Inject(Services.CHAT) private readonly chatService:IChatsService,
                @Inject(Services.GROUP) private readonly groupChatService:IGroupChatsService,
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
            console.log(client.rooms);
            //this.sessions.saveSession(client.user.id,client);
            await this.userService.updateUserPresence(client.user.id,"Online");

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
    async privateMessageEvent(@MessageBody() {message,chat,recipientId}:NewPrivateMessageEventParams) {
        this.server.to(`private-chat-${recipientId}`).emit('messageReceived', {message,chat}); 
    }
    @SubscribeMessage('newGroupMessage')
    async groupMessageEvent(@ConnectedSocket() client:AuthenticatedSocket,@MessageBody() {chat,message}:CreateGroupMessageResponse) {
        if(!client.user) return;
        chat.members.map((member => {
            if(member.id !== client.user.id) this.server.to(`private-chat-${member.id}`).emit('groupMessageReceived', {message,chat})
        }));
    }
    @SubscribeMessage('onGroupMessageDeletion')
    async groupMessageDeletedEvent(@ConnectedSocket() client:AuthenticatedSocket,@MessageBody() {messageId,chatId,userId}:DeleteMessageEventParams) {
        const groupChat = await this.groupChatService.getGroupChatById(chatId);
        if(!client.user) return;
        groupChat.members.map((member => {
            if(member.id !== client.user.id) this.server.to(`private-chat-${member.id}`).emit('groupMessageDeleted', {messageId});
        }));
    }
    @SubscribeMessage('onGroupMessageEdit')
    async groupMessageEditedEvent(@ConnectedSocket() client:AuthenticatedSocket, @MessageBody() {messageId,chatId,messageContent}:EditMessageEventParams) {
        const groupChat = await this.groupChatService.getGroupChatById(chatId);
        if(!client.user) return;
        groupChat.members.map((member => {
            if(member.id !== client.user.id) this.server.to(`private-chat-${member.id}`).emit('groupMessageEdited', {messageId,messageContent,groupChat});
        }));
    }
    @SubscribeMessage('privateMessageDeleted')
    async privateMessageDeletedEvent(@MessageBody() {messageId,chatId,userId}:DeleteMessageEventParams) {
        const chat = await this.chatService.getChatById(chatId);
        const recipient = chat.recipient.id === userId ? chat.creator : chat.recipient
        this.server.to(`private-chat-${recipient.id}`).emit('messageDeleted', {messageId}); 
    }
    @SubscribeMessage('privateMessageEdited')
    async privateMessageEditedEvent(@ConnectedSocket() client:AuthenticatedSocket, @MessageBody() {messageId,chatId,messageContent}:EditMessageEventParams) {
        const chat = await this.chatService.getChatById(chatId);
        if(!client.user) return;
        const recipient = chat.recipient.id === client.user.id ? chat.creator : chat.recipient
        this.server.to(`private-chat-${recipient.id}`).emit('messageEdited', {messageId,messageContent,chat}); 
    }
    @SubscribeMessage('onUserIdle')
    async userIdleEvent(@ConnectedSocket() client:AuthenticatedSocket) {
        if(!client.user) return;
        console.log('User Idle event received');
        await this.userService.updateUserPresence(client.user.id,"Away");
    }
    @SubscribeMessage('onGroupChatMemberAdd')
    async groupChatMemberAdd(@ConnectedSocket() client:AuthenticatedSocket,@MessageBody() {groupId,userId}:EditGroupChatMemberEventParams) {
        const groupChat = await this.groupChatService.getGroupChatById(groupId);
        if(!client.user) return;
        groupChat.members.map((member => {
            if(member.id !== client.user.id) this.server.to(`private-chat-${member.id}`).emit('groupMessageMemberAdded', {groupId,userId});
        }));
    }
    @SubscribeMessage('onGroupChatMemberRemove')
    async groupChatMemberRemove(@ConnectedSocket() client:AuthenticatedSocket,@MessageBody() {groupId,userId}:EditGroupChatMemberEventParams) {
        const groupChat = await this.groupChatService.getGroupChatById(groupId);
        if(!client.user) return;
        groupChat.members.map((member => {
            if(member.id !== client.user.id) this.server.to(`private-chat-${member.id}`).emit('groupMessageMemberRemoved', {groupId,userId});
        }));
    }
}