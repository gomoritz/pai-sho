import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http"
import { RoomManager } from "./room/room-manager.js";
import { JoinRoomPacket, JoinRoomEvent, JoinRoomResponseEvent } from "../shared/events/join-room.js";
import { JoinGameEvent, JoinGamePacket, JoinGameResponseEvent } from "../shared/events/join-game.js";

export let serverIO: Server

export function attachSocketServer(http: HttpServer) {
    serverIO = new Server(http)

    serverIO.on("connection", (socket: Socket) => {
        socket.on(JoinRoomEvent, (packet: JoinRoomPacket) => {
            socket.emit(JoinRoomResponseEvent, { success: RoomManager.joinRoom(socket, packet) })
        })
        socket.on(JoinGameEvent, (packet: JoinGamePacket) => {
            socket.emit(JoinGameResponseEvent, { success: RoomManager.joinGame(socket, packet) })
        })
    })
}