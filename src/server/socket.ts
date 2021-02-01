import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http"
import { RoomManager } from "./room/room-manager.js";
import { JoinRoomPacket, JoinRoomEvent, JoinRoomResponseEvent } from "../shared/events/join-room.js";

export let serverIO: Server

export function attachSocketServer(http: HttpServer) {
    serverIO = new Server(http)

    serverIO.on("connection", (socket: Socket) => {
        socket.on(JoinRoomEvent, (event: JoinRoomPacket) => {
            if (!RoomManager.joinRoom(socket, event)) {
                socket.emit(JoinRoomResponseEvent, { success: false })
            }
        })
    })
}