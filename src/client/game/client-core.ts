import { Tile } from "../../shared/logic/tiles.js";
import Field from "../../shared/logic/field.js";
import { doTileMove } from "../../shared/logic/tile-moves.js";
import { gameBoard } from "./logic-core.js";
import { draw } from "./game.js";
import { renderObjects } from "./render-core.js";
import DebugGameOverview from "./objects/debug-game-overview.js";
import { setInCheck, setIsMyTurn } from "./logic/whose-turn-is-it.js";
import { myTiles, opponentTiles, respawnAvatar } from "../../shared/logic/lineup.js";
import { hideOverlay, setNames, showGameEnd } from "./utils/user-interface.js";
import { GameStartEvent, GameStartPacket } from "../../shared/events/game-start.js";
import { GameAbandonEvent } from "../../shared/events/game-abandon.js";
import { GameEndEvent, GameEndPacket } from "../../shared/events/game-end.js";
import { WhoseTurnEvent, WhoseTurnPacket } from "../../shared/events/whose-turn.js";
import { ThrowTilesEvent, ThrowTilesPacket } from "../../shared/events/throw-tiles.js";
import { TileMoveEvent, TileMovePacket, TileMoveResponseEvent, TileMoveResponsePacket } from "../../shared/events/tile-move.js";
import { PassChainJumpEvent } from "../../shared/events/pass-chain-jump.js";
import { InCheckEvent, InCheckPacket } from "../../shared/events/in-check.js";
import { JoinGameEvent, JoinGameResponsePacket, JoinGameResponseEvent } from "../../shared/events/join-game.js";
import { RespawnAvatarEvent, RespawnAvatarPacket } from "../../shared/events/respawn-avatar.js";

export const clientIO: SocketIOClient.Socket = io()

let gameKey: string

export function connectToServer() {
    const url = new URL(window.location.href);
    const _gameKey = url.searchParams.get("game_key")

    if (_gameKey == null) {
        sendBackToLobby()
        return
    }

    history.pushState({}, "Pai Sho | Game", "/game/")

    gameKey = _gameKey
    emitJoinGame()
}

export function sendBackToLobby() {
    clientIO.disconnect()
    const url = new URL(location.href)
    url.search = ""

    if (gameKey != null) {
        const decoded = JSON.parse(atob(gameKey.split(".")[1]))
        url.pathname = "/room"
        url.searchParams.set("id", decoded.roomId)
    } else {
        url.pathname = "/play"
    }

    window.location.href = url.href
}

function emitJoinGame() {
    clientIO.emit(JoinGameEvent, { gameKey })
}

clientIO.on(JoinGameResponseEvent, (packet: JoinGameResponsePacket) => {
    if (!packet.success) {
        sendBackToLobby()
    } else {
        console.log(`Successfully joined game`)
    }
})

export function emitMoveTile(tile: Tile, field: Field) {
    const event: TileMovePacket = { tileId: tile.id, field: { x: field.x, y: field.y } }
    clientIO.emit(TileMoveEvent, event)
}

clientIO.on(TileMoveResponseEvent, (packet: TileMoveResponsePacket) => {
    doTileMove(gameBoard, packet)
    draw()
})

clientIO.on(GameStartEvent, (packet: GameStartPacket) => {
    renderObjects.push(new DebugGameOverview(packet))
    hideOverlay()
    setNames(packet)
    setIsMyTurn(packet, true)
})

clientIO.on(GameEndEvent, (packet: GameEndPacket) => {
    showGameEnd(packet.win)
})

clientIO.on(GameAbandonEvent, () => sendBackToLobby())

clientIO.on("disconnect", () => sendBackToLobby())

clientIO.on(WhoseTurnEvent, (packet: WhoseTurnPacket) => {
    setIsMyTurn(packet)
})

clientIO.on(InCheckEvent, (packet: InCheckPacket) => {
    setInCheck(packet)
})

export function emitPassChainJump() {
    clientIO.emit(PassChainJumpEvent)
}

clientIO.on(ThrowTilesEvent, (packet: ThrowTilesPacket) => {
    packet.actions.forEach(action => {
        const isMyVictim = !action.thrower.isMyTile
        const victimTile = (isMyVictim ? myTiles : opponentTiles).find(it => it.id == action.victim.tile)!!

        victimTile.setThrown()
        console.log(`${isMyVictim ? "My" : "Opponent"} tile ${victimTile.id} was thrown by ${action.thrower.tile}`)
    })
})

clientIO.on(RespawnAvatarEvent, (packet: RespawnAvatarPacket) => {
    respawnAvatar(gameBoard, packet)
    draw()
})