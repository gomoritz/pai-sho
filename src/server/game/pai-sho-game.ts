import GameRoom from "../room/game-room.js";
import Player from "../objects/player.js";
import { TileMoveEvent, TileMoveResponse } from "../../shared/events/move-events.js";
import GameBoard from "../../shared/logic/game-board.js";
import { buildLineup } from "../../shared/logic/lineup.js";

export default class PaiShoGame {
    currentPlayer: Player | null = null
    gameBoard = new GameBoard()

    constructor(private room: GameRoom) {
        this.gameBoard.loadFields()
        buildLineup(this.gameBoard)
    }

    handleTileMove(player: Player, event: TileMoveEvent) {
        if (player != this.currentPlayer) {
            return
        }

        let serverField: { x: number, y: number }
        let isExecutorA: boolean

        if (player == this.room.playerA) {
            serverField = event.field
            isExecutorA = true
            this.currentPlayer = this.room.playerB
        } else if (player == this.room.playerB) {
            serverField = { x: -event.field.x, y: -event.field.y }
            isExecutorA = false
            this.currentPlayer = this.room.playerA
        } else return

        const response: TileMoveResponse = { tileId: event.tileId, field: serverField, isMoveByMe: isExecutorA }
        this.room.playerA!!.socket.emit("<-move-tile", response)

        response.isMoveByMe = !isExecutorA
        response.field = { x: -serverField.x, y: -serverField.y }
        this.room.playerB!!.socket.emit("<-move-tile", response)

        console.log(`${player.username} moved ${event.tileId} to [${serverField.x},${serverField.y}]`)
    }
}