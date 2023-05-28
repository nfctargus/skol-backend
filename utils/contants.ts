export enum Routes {
    AUTH = 'auth',
    USER = 'users',
    FRIEND = 'friends',
    CHAT = 'chats',
    GROUP_CHAT = 'groups',
    PRIVATE_MESSAGE = 'chats/:id/messages',
    GROUP_MESSAGE = 'groups/:id/messages'
}
export enum Services {
    AUTH = 'AUTH_SERVICE',
    USER = 'USER_SERVICE',
    FRIEND = 'FRIEND_SERVICE',
    CHAT = 'CHAT_SERVICE',
    GROUP = 'GROUP_SERVICE',
    PRIVATE_MESSAGE = 'PRIVATE_MESSAGE_SERVICE',
    GROUP_MESSAGE = 'GROUP_MESSAGE_SERVICE'
}