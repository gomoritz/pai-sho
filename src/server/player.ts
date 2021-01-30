import { Socket } from "socket.io";

export default class Player {
    constructor(public username: string, public socket: Socket) {}
}