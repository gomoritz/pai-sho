import GameRoom from "./game-room.js";
import Player from "../objects/player.js";
import { Socket } from "socket.io";
import { JoinRoomPacket } from "../../shared/events/join-room.js";

export namespace RoomManager {
    const rooms: GameRoom[] = [new GameRoom("test")]

    export function joinRoom(socket: Socket, event: JoinRoomPacket): boolean {
        const target = getRoomById(event.roomId)
        if (target == null) return false
        if (target.isFull()) return false

        const player = new Player(event.username, socket)
        if (target.isUsernameTaken(player.username)) return false

        target.addPlayerToRoom(player)
        return true
    }

    export function getRoomById(id: string): GameRoom | null {
        return rooms.find(it => it.id == id) ?? null
    }
}