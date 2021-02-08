import Player from "../objects/player.js";
import PaiShoGame from "../game/pai-sho-game.js";
import { TileMoveEvent, TileMovePacket } from "../../shared/events/tile-move.js";
import { PassChainJumpEvent } from "../../shared/events/pass-chain-jump.js";
import Lobby from "./lobby.js";
import colors from "colors/safe.js"
import { AirTile, AvatarTile, EarthTile, FireTile, LotusTile, WaterTile } from "../../shared/logic/tiles.js";

export default class GameRoom {
    playerA: Player | null = null
    playerB: Player | null = null
    allPlayers: Player[] = []

    game: PaiShoGame = new PaiShoGame(this)
    lobby: Lobby = new Lobby(this)

    constructor(public id: string, public isPrivate: boolean = false) {
    }

    addPlayerToGame(player: Player) {
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
        player.socket.on("disconnect", () => this.removePlayerFromGame(player))
        player.socket.on(TileMoveEvent, (packet: TileMovePacket) => this.game.handleTileMove(player, packet))
        player.socket.on(PassChainJumpEvent, () => this.game.handlePassChainJump(player))

        this.log(`${player.username} joined the game`)

        if (this.allPlayers.length == 2) {
            this.game.start()
        }
    }

    removePlayerFromGame(player: Player) {
        if (this.playerA == player) {
            this.playerA = null
        } else if (this.playerB == player) {
            this.playerB = null
        } else {
            return
        }

        this.allPlayers.splice(this.allPlayers.indexOf(player), 1)
        player.socket.leave(this.id)

        this.log(`${player.username} left the game`)

        if (this.allPlayers.length == 1) {
            this.game.abandon()
        }
    }

    isFull(): boolean {
        return this.playerA != null && this.playerB != null
    }

    log(...messages: any) {
        const date = new Date()
        const h = date.getHours(), m = date.getMinutes(), s = date.getSeconds()
        const hh = h < 10 ? `0${h}` : `${h}`, mm = m < 10 ? `0${m}` : `${m}`, ss = s < 10 ? `0${s}` : `${s}`
        const id = this.id.length > 6 ? this.id.substring(0, 6) : this.id

        console.log(
            colors.gray("[") + colors.cyan(`${hh}:${mm}:${ss}`) + colors.gray("] ") +
            colors.gray("[") + colors.green(id) + colors.gray("]"),
            ...messages
        )
    }

    exportBoard() {
        let header = "      "
        for (let x = -8; x <= 8; x++) {
            header += (x < 0 ? colors.gray("|") + `  ${x} ` : colors.gray("|") + `  ${x}  `)
        }
        this.log("Exporting game board of room " + colors.red(this.id))
        console.log("")
        console.log(colors.white(header))
        for (let y = -8; y <= 8; y++) {
            let line = colors.white(y < 0 ? `  ${y}  ` : `   ${y}  `)
            for (let x = -8; x <= 8; x++) {
                const field = this.game.gameBoard.getField(x, y)
                if (field) {
                    const tile = field.tile;
                    if (tile) {
                        const short = tile instanceof LotusTile ? colors.white("LOTUS")
                            : tile instanceof AvatarTile ? colors.red(colors.bold("AVATR"))
                                : tile instanceof FireTile ? colors.yellow("FIRE ")
                                    : tile instanceof WaterTile ? colors.blue("WATER")
                                        : tile instanceof EarthTile ? colors.green("EARTH")
                                            : tile instanceof AirTile ? colors.cyan(" AIR ")
                                                : ""
                        line += colors.gray("|") + short
                    } else {
                        line += colors.gray("|     ")
                    }
                } else {
                    line += colors.gray("|XXXXX")
                }
            }
            console.log(line)
        }
        console.log("")
    }
}