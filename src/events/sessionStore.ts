import { Injectable } from "@nestjs/common";
import { ISessionStore, IUserSocket } from "utils/interfaces";
import { Socket } from 'socket.io';

@Injectable()
export class SessionStore implements ISessionStore {
    private readonly sessions:Map<string,Socket> = new Map();
    constructor() {}

    findSession(id:string):Socket {
        return this.sessions.get(id);
    }
    saveSession(id:string,socket:Socket) {
        this.sessions.set(id, socket);
        
    }
    findAllSessions():Socket[] {
        return [...this.sessions.values()];
    }
    deleteSession(id:string) {
        this.sessions.delete(id);
    }
    
}