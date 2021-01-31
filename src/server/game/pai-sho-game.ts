import GameRoom from "../room/game-room.js";
import Player from "../objects/player.js";
import { TileMoveEvent, TileMoveResponse } from "../../shared/events/move-events.js";
import GameBoard from "../../shared/logic/game-board.js";
import { buildLineup, myTiles, opponentTiles } from "../../shared/logic/lineup.js";
import { canMoveTileToField, canPerformJump } from "../../shared/logic/tile-moves.js";
import { LotusTile, Tile } from "../../shared/logic/tiles.js";
import Field from "../../shared/logic/field.js";

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
        let nextPlayer: Player

        if (player == this.room.playerA) {
            serverField = event.field
            isExecutorA = true
            nextPlayer = this.room.playerB!!
        } else if (player == this.room.playerB) {
            serverField = { x: -event.field.x, y: -event.field.y }
            isExecutorA = false
            nextPlayer = this.room.playerA!!
        } else return

        // server-side game board is synced with player A
        const field = this.gameBoard.getField(serverField.x, serverField.y)
        const tile = (isExecutorA ? myTiles : opponentTiles).find(it => it.id == event.tileId)

        if (field == null || tile == null || !canMoveTileToField(tile, field)) {
            return console.log("error invalid tile move");
        }

        const originalField = tile.field!!
        tile.field!!.tile = null
        tile.field = field
        field.tile = tile

        const response: TileMoveResponse = { tileId: event.tileId, field: serverField, isMoveByMe: isExecutorA }
        this.room.playerA!!.socket.emit("<-move-tile", response)

        response.isMoveByMe = !isExecutorA
        response.field = { x: -serverField.x, y: -serverField.y }
        this.room.playerB!!.socket.emit("<-move-tile", response)

        console.log(`${player.username} moved ${event.tileId} to [${serverField.x},${serverField.y}]`)

        const chainJumps = this.canPerformChainJump(originalField, tile)
        if (chainJumps != null) {
            console.log(`${player.username} can perform a chain jump`)
        } else {
            this.currentPlayer = nextPlayer
        }
    }

    canPerformChainJump(originalField: Field, tile: Tile): Field[] | null {
        const wasJump = !(tile instanceof LotusTile) && canPerformJump(originalField, tile.field!!)
        if (!wasJump) return null

        return Object.values(this.gameBoard.fields).filter(field =>
            canPerformJump(tile.field!!, field) &&
            !(field.x == originalField.x && field.y == originalField.y)
        );
    }
}