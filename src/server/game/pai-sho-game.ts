import GameRoom from "../room/game-room.js";
import Player from "../objects/player.js";
import { TileMoveEvent, TileMoveResponse } from "../../shared/move-events.js";

export default class PaiShoGame {
    constructor(private room: GameRoom) {
    }

    handleTileMove(player: Player, event: TileMoveEvent) {
        let serverField: { x: number, y: number }
        let isExecutorA: boolean

        if (player == this.room.playerA) {
            serverField = event.field
            isExecutorA = true
        } else if (player == this.room.playerB) {
            serverField = { x: -event.field.x, y: -event.field.y }
            isExecutorA = false
        } else return

        const response: TileMoveResponse = { tileId: event.tileId, field: serverField, isMoveByMe: isExecutorA }
        this.room.playerA!!.socket.emit("<-move-tile", response)

        response.isMoveByMe = !isExecutorA
        response.field = { x: -serverField.x, y: -serverField.y }
        this.room.playerB!!.socket.emit("<-move-tile", response)

        console.log(`${player.username} moved ${event.tileId} to [${serverField.x},${serverField.y}]`)
    }
}