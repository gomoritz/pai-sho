import Player from "../player.js";
import { TileMoveEvent, TileMoveResponse } from "../../shared/move-events.js";

export default class GameRoom {
    playerA: Player | null = null
    playerB: Player | null = null

    allPlayers: Player[] = []

    constructor(public id: string) {
    }

    handleTileMove(player: Player, event: TileMoveEvent) {
        let serverField: { x: number, y: number }
        let isExecutorA: boolean

        if (player == this.playerA) {
            serverField = event.field
            isExecutorA = true
        } else if (player == this.playerB) {
            serverField = { x: -event.field.x, y: -event.field.y }
            isExecutorA = false
        } else return

        const response: TileMoveResponse = { tileId: event.tileId, field: serverField, isMoveByMe: isExecutorA }
        this.playerA!!.socket.emit("<-move-tile", response)

        response.isMoveByMe = !isExecutorA
        response.field = { x: -serverField.x, y: -serverField.y }
        this.playerB!!.socket.emit("<-move-tile", response)

        console.log(`${player.username} moved ${event.tileId} to [${serverField.x},${serverField.y}]`)
    }

    addPlayerToRoom(player: Player) {
        if (this.playerA == null) {
            this.playerA = player
        } else if (this.playerB == null) {
            this.playerB = player
        } else {
            throw "The room is already full"
        }

        this.allPlayers.push(player)
        player.socket.join(this.id)
        player.socket.on("disconnect", () => this.removePlayerFromRoom(player))
        player.socket.on("move-tile", (event: TileMoveEvent) => this.handleTileMove(player, event))

        console.log(`${player.username} joined room ${this.id}`)
    }

    removePlayerFromRoom(player: Player) {
        if (this.playerA == player) {
            this.playerA = null
        } else if (this.playerB == player) {
            this.playerB = null
        } else {
            throw "The player isn't inside the room"
        }

        this.allPlayers.splice(this.allPlayers.indexOf(player), 1)
        player.socket.leave(this.id)

        console.log(`${player.username} left room ${this.id}`)
    }

    isFull(): boolean {
        return this.playerA != null && this.playerB != null
    }

    isUsernameTaken(username: string): boolean {
        return this.allPlayers.some(it => it.username == username)
    }
}