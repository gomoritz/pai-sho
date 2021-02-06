import { Socket } from "socket.io";

export default class Player {
    public inCheck: boolean = false
    public secondTimeInCheck: boolean = false
    public lostAvatar: boolean = false

    constructor(public username: string, public socket: Socket) {
    }
}