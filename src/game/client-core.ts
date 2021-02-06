import { Tile } from "../shared/logic/tiles.js";
import Field from "../shared/logic/field.js";
import { doTileMove } from "../shared/logic/tile-moves.js";
import { gameBoard } from "./logic-core.js";
import { draw } from "./game.js";
import { renderObjects } from "./render-core.js";
import DebugGameOverview from "./objects/debug-game-overview.js";
import { setInCheck, setIsMyTurn } from "./logic/whose-turn-is-it.js";
import { myTiles, opponentTiles, respawnAvatar } from "../shared/logic/lineup.js";
import { hideOverlay, setNames, showOverlay } from "./utils/user-interface.js";
import { GameStartEvent, GameStartPacket } from "../shared/events/game-start.js";
import { GameAbandonEvent } from "../shared/events/game-abandon.js";
import { GameEndEvent, GameEndPacket } from "../shared/events/game-end.js";
import { WhoseTurnEvent, WhoseTurnPacket } from "../shared/events/whose-turn.js";
import { ThrowTilesEvent, ThrowTilesPacket } from "../shared/events/throw-tiles.js";
import { TileMoveEvent, TileMovePacket, TileMoveResponseEvent, TileMoveResponsePacket } from "../shared/events/tile-move.js";
import { PassChainJumpEvent } from "../shared/events/pass-chain-jump.js";
import { InCheckEvent, InCheckPacket } from "../shared/events/in-check.js";
import { JoinRoomPacket, JoinRoomResponsePacket } from "../shared/events/join-room.js";
import { RespawnAvatarEvent, RespawnAvatarPacket } from "../shared/events/respawn-avatar.js";

export const clientIO: SocketIOClient.Socket = io()

let roomId: string
let username: string

export function connectToServer() {
    const url = new URL(window.location.href);
    const _roomId = url.searchParams.get("roomId")
    const _username = url.searchParams.get("username")

    if (_roomId == null || _username == null) {
        clientIO.disconnect()
        alert("Missing request parameters")
        // TODO: send back to main page
        return
    }

    history.pushState({}, "Pai Sho | Game", "/game/")

    roomId = _roomId
    username = _username
    emitJoinRoom(_roomId, _username)
}

function emitJoinRoom(roomId: string, username: string) {
    const event: JoinRoomPacket = { roomId, username };
    clientIO.emit("join-room", event)
}

clientIO.on("<-join-room", (packet: JoinRoomResponsePacket) => {
    if (packet.success) {

    } else {
        clientIO.disconnect()
        alert("Failed to join room")
        // TODO: send back to main page
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
    showOverlay(`You ${packet.win ? "won" : "lost"}!`)
})

clientIO.on(GameAbandonEvent, () => {
    window.location.search = `roomId=${roomId}&username=${username}`
})

clientIO.on("disconnect", () => {
    window.location.search = `roomId=${roomId}&username=${username}`
})

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