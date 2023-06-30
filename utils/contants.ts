import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export enum Routes {
    AUTH = 'auth',
    USER = 'users',
    USER_PROFILE = 'users/profiles',
    USER_PRESENCE = 'users/presence',
    FRIEND = 'friends',
    CHAT = 'chats',
    GROUP_CHAT = 'groups',
    PRIVATE_MESSAGE = 'chats/:id/messages',
    GROUP_MESSAGE = 'groups/:id/messages'
}
export enum Services {
    AUTH = 'AUTH_SERVICE',
    USER = 'USER_SERVICE',
    USER_PROFILE = 'USER_PROFILE_SERVICE',
    USER_PRESENCE = 'USER_PRESENCE_SERVICE',
    FRIEND = 'FRIEND_SERVICE',
    CHAT = 'CHAT_SERVICE',
    GROUP = 'GROUP_SERVICE',
    PRIVATE_MESSAGE = 'PRIVATE_MESSAGE_SERVICE',
    GROUP_MESSAGE = 'GROUP_MESSAGE_SERVICE',
    GATEWAY_SESSION_STORE = 'GATEWAY_SESSION_STORE'
}