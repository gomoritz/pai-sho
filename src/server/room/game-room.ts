import Player from "../objects/player.js";
import PaiShoGame from "../game/pai-sho-game.js";
import { TileMoveEvent, TileMovePacket } from "../../shared/events/tile-move.js";
import { PassChainJumpEvent } from "../../shared/events/pass-chain-jump.js";

export default class GameRoom {
    playerA: Player | null = null
    playerB: Player | null = null
    allPlayers: Player[] = []

    game: PaiShoGame = new PaiShoGame(this)

    constructor(public id: string) {
    }

    addPlayerToRoom(player: Player) {
        if (this.playerA == null) {
            this.playerA = player
            this.game.currentPlayer = player
        } else if (this.playerB == null) {
            this.playerB = player
        } else {
            return
        }

        this.allPlayers.push(player)
        player.socket.join(this.id)
        player.socket.on("disconnect", () => this.removePlayerFromRoom(player))
        player.socket.on(TileMoveEvent, (packet: TileMovePacket) => this.game.handleTileMove(player, packet))
        player.socket.on(PassChainJumpEvent, () => this.game.handlePassChainJump(player))

        console.log(`${player.username} joined room ${this.id}`)

        if (this.allPlayers.length == 2) {
            this.game.start()
        }
    }

    removePlayerFromRoom(player: Player) {
        if (this.playerA == player) {
            this.playerA = null
        } else if (this.playerB == player) {
            this.playerB = null
        } else {
            return
        }

        this.allPlayers.splice(this.allPlayers.indexOf(player), 1)
        player.socket.leave(this.id)

        console.log(`${player.username} left room ${this.id}`)

        if (this.allPlayers.length == 1) {
            this.game.abandon()
        }
    }

    isFull(): boolean {
        return this.playerA != null && this.playerB != null
    }

    isUsernameTaken(username: string): boolean {
        return this.allPlayers.some(it => it.username == username)
    }
}