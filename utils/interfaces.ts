import { Socket } from 'socket.io';

export interface ISessionStore {
    findSession(id:string):Socket;
    saveSession(id:string,socket:Socket);
    findAllSessions():Socket[];
    deleteSession(id:string);
}