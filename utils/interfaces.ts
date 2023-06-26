import { Socket } from 'socket.io';
import { User } from './typeorm';

export interface AuthenticatedSocket extends Socket {
    user?:User;
}
export interface ISessionStore {
    findSession(id:number):Socket;
    saveSession(id:number,socket:Socket);
    findAllSessions():Socket[];
    deleteSession(id:number);
}