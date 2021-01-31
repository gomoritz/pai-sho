import GameRoom from "../room/game-room.js";
import Player from "../objects/player.js";
import { TileMoveEvent, TileMoveResponse } from "../../shared/events/move-events.js";
import GameBoard from "../../shared/logic/game-board.js";
import { buildLineup, myTiles, opponentTiles } from "../../shared/logic/lineup.js";
import { canMoveTileToField, canPerformJump } from "../../shared/logic/tile-moves.js";
import { LotusTile, Tile } from "../../shared/logic/tiles.js";
import Field from "../../shared/logic/field.js";
import { gameStartKey, GameStartEvent, WhoseTurnEvent, whoseTurnKey, ThrowAction, ThrowsEvent, throwsKey } from "../../shared/events/game-events.js";

export default class PaiShoGame {
    currentPlayer: Player | null = null
    gameBoard = new GameBoard()
    chainJumps: Field[] | null

    constructor(private room: GameRoom) {
        this.gameBoard.loadFields()
        buildLineup(this.gameBoard)
    }

    start() {
        this.room.allPlayers.forEach(player => {
            const event: GameStartEvent = {
                role: player == this.room.playerA ? "a" : "b",
                myTurn: player == this.room.playerA,
                players: {
                    a: this.room.playerA!!.username,
                    b: this.room.playerB!!.username
                }
            }
            player.socket.emit(gameStartKey, event)
        })
    }

    abandon() {

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

        if (field == null || tile == null || !canMoveTileToField(tile, field) || !this.verifyChainJumps(field)) {
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

        if (!this.checkForThrows(tile)) {
            this.chainJumps = this.canPerformChainJump(originalField, tile)
            if (this.chainJumps != null) {
                console.log(`${player.username} can perform a chain jump`)
                this.setWhoseTurn(player, this.chainJumps)
                return
            }
        }

        this.setWhoseTurn(nextPlayer)
    }

    /**
     * Returns true if my tile was thrown.
     */
    checkForThrows(myTile: Tile): boolean {
        // neighbour fields that have an enemy tile on them
        const occupiedNeighbourFields = myTile.field!!.getNeighbourFields()
            .filter(field => field.tile != null && field.tile.isDark != myTile.isDark)

        // calculate all tiles that i can throw
        const totalThrows: ThrowAction[] = occupiedNeighbourFields
            .filter(field => myTile.canThrow(field.tile!!))
            .map(field => {
                const obj = {
                    thrower: { tile: myTile.id, isMyTile: true },
                    victim: { tile: field.tile!!.id }
                };
                field.tile!!.setThrown()
                return obj;
            })

        // check if a still standing tile can throw me
        const candidate = occupiedNeighbourFields.find(field => field.tile?.canThrow(myTile))

        // if so, push the throw to the total throws array
        if (candidate != null) {
            totalThrows.push({
                thrower: { tile: candidate.tile!!.id, isMyTile: false },
                victim: { tile: myTile.id }
            })
            myTile.setThrown()
        }

        if (totalThrows.length > 0) {
            const event: ThrowsEvent = { actions: totalThrows }
            this.currentPlayer!!.socket.emit(throwsKey, event)

            const otherPlayer = this.getOtherPlayer(this.currentPlayer!!);
            // invert 'isMyTile' property before sending to other player
            event.actions.forEach(action => action.thrower.isMyTile = !action.thrower.isMyTile)
            otherPlayer.socket.emit(throwsKey, event)

            totalThrows.forEach(action => {
                const performer = action.thrower.isMyTile ? this.currentPlayer : otherPlayer;
                console.log(`${performer!!.username} threw ${action.victim.tile} with ${action.thrower.tile}`)
            })
        }

        return candidate != null
    }

    canPerformChainJump(originalField: Field, tile: Tile): Field[] | null {
        const wasJump = !(tile instanceof LotusTile) && canPerformJump(originalField, tile.field!!)
        if (!wasJump) return null

        const fields = Object.values(this.gameBoard.fields).filter(field => canPerformJump(tile.field!!, field));
        return fields.length == 0 ? null : fields;
    }

    handlePassChainJump(player: Player) {
        if (this.currentPlayer == player && this.chainJumps != null) {
            this.chainJumps = null
            this.setWhoseTurn(this.getOtherPlayer(player))
            console.log(`${player.username} passed his chain jump`)
        }
    }

    setWhoseTurn(nextPlayer: Player, chainJumps?: Field[]) {
        this.currentPlayer = nextPlayer
        this.room.allPlayers.forEach(player => {
            const event: WhoseTurnEvent = { myTurn: player == nextPlayer }
            if (event.myTurn && chainJumps != undefined) {
                event.chainJumps = chainJumps.map(f => ({ x: f.x, y: f.y }))
            }
            player.socket.emit(whoseTurnKey, event)
        })
    }

    /**
     * If the player is allowed to perform a chain-jump, this function makes sure that
     * the given field is a potential target of such a chain-jump. If no chain-jumps
     * are available, this function returns true for all fields.
     */
    verifyChainJumps(field: Field): boolean {
        return this.chainJumps == null || this.chainJumps.some(cj => field.equals(cj))
    }

    getOtherPlayer(p: Player): Player {
        return p == this.room.playerA ? this.room.playerB!! : this.room.playerA!!
    }
}