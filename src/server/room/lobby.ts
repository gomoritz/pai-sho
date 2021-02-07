import GameRoom from "./game-room.js";
import { Socket } from "socket.io";
import { ChangeNameEvent, ChangeNamePacket } from "../../shared/events/change-name.js";
import { PublishLobbyEntitiesEvent, PublishLobbyEntitiesPacket } from "../../shared/events/publish-lobby-entities.js";
import { RedirectToGameEvent, RedirectToGamePacket, StartRoomEvent } from "../../shared/events/start-room.js";
import { serializeGameKey } from "../utils/tokenizer.js";
import { RoomManager } from "./room-manager.js";

export default class Lobby {
    entities: LobbyEntity[] = []

    constructor(private room: GameRoom) {
    }

    addToLobby(socket: Socket, username: string): boolean {
        if (this.entities.length >= 2) return false
        if (!this.validateName(username)) return false

        const entity = new LobbyEntity(socket, username)
        this.entities.push(entity)

        socket.on(ChangeNameEvent, (packet: ChangeNamePacket) => this.renameEntity(entity, packet))
        socket.on(StartRoomEvent, () => this.startRoom(entity))
        socket.on("disconnect", () => this.removeFromLobby(entity))
        this.publishLobbyEntities()
        console.log(`${username} joined lobby of room ${this.room.id}`)
        return true
    }

    removeFromLobby(entity: LobbyEntity) {
        this.entities.splice(this.entities.indexOf(entity), 1)
        this.publishLobbyEntities()
        console.log(`${entity.username} left lobby of room ${this.room.id}`)

        if (this.entities.length == 0 && this.room.id != "test") {
            RoomManager.deleteRoom(this.room)
        }
    }

    publishLobbyEntities() {
        this.entities.forEach(entity => {
            const packet: PublishLobbyEntitiesPacket = {
                entities: this.entities.map(it => ({
                    username: it.username,
                    me: it == entity
                }))
            }
            entity.socket.emit(PublishLobbyEntitiesEvent, packet)
        })
    }

    renameEntity(entity: LobbyEntity, packet: ChangeNamePacket) {
        if (this.validateName(packet.newUsername)) {
            console.log(`Renamed ${entity.username} to ${packet.newUsername}`)
            entity.username = packet.newUsername
        }
        this.publishLobbyEntities()
    }

    startRoom(entity: LobbyEntity) {
        if (this.entities.length != 2) return

        this.entities.forEach(entity => {
            const gameKey = serializeGameKey({ roomId: this.room.id, username: entity.username })
            const packet: RedirectToGamePacket = { gameKey }
            entity.socket.emit(RedirectToGameEvent, packet)
        })

        console.log(`${entity.username} started the room ${this.room.id}`)
    }

    validateName(name: string): boolean {
        if (name.length < 3) return false
        if (name.length > 16) return false

        const allowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_. äöüÄÖÜ"
        for (let i = 0; i < name.length; i++) {
            const char = name.charAt(i)
            if (allowedCharacters.indexOf(char) == -1)
                return false
        }
        return true
    }
}

export class LobbyEntity {
    constructor(public socket: Socket, public username: string) {
    }
}