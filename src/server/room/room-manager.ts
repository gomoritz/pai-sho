import GameRoom from "./game-room.js";
import { Socket } from "socket.io";
import { JoinGamePacket } from "../../shared/events/join-game.js";
import Player from "../objects/player.js";
import { JoinRoomPacket } from "../../shared/events/join-room.js";
import { deserializeGameKey } from "../utils/tokenizer.js";

export namespace RoomManager {
    const rooms: GameRoom[] = [new GameRoom("test", true)]

    export function joinRoom(socket: Socket, packet: JoinRoomPacket): boolean {
        const target = getRoomById(packet.roomId)
        if (target == null) return false

        return target.lobby.addToLobby(socket, packet.username)
    }

    export function joinGame(socket: Socket, packet: JoinGamePacket): boolean {
        const gameKey = deserializeGameKey(packet.gameKey)
        if (gameKey == null) return false

        const target = getRoomById(gameKey.roomId)
        if (target == null) return false
        if (target.isFull()) return false

        target.addPlayerToGame(new Player(gameKey.username, socket))
        return true
    }

    export function getRoomById(id: string): GameRoom | null {
        return rooms.find(it => it.id == id) ?? null
    }

    export function createPrivateRoom(id: string) {
        const room = new GameRoom(id, true);
        rooms.push(room)
        return room
    }

    export function deleteRoom(room: GameRoom) {
        rooms.splice(rooms.indexOf(room), 1)
        console.log(`Deleted room ${room.id}`)
    }

    export function queue() {
        let availableRoom = rooms.find(it => !it.isPrivate && it.lobby.canJoin && it.lobby.entities.length < 2)
        if (!availableRoom) {
            availableRoom = new GameRoom(generateUUID(), false)
            rooms.push(availableRoom)
        }
        return availableRoom
    }
}

export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}