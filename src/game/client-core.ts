import { JoinRoomEvent, JoinRoomResponse } from "../shared/events/room-events.js";
import { Tile } from "../shared/logic/tiles.js";
import Field from "../shared/logic/field.js";
import { CheckStatusEvent, checkStatusKey, passChainJumpKey, TileMoveEvent, TileMoveResponse } from "../shared/events/move-events.js";
import { doTileMove } from "../shared/logic/tile-moves.js";
import { gameBoard } from "./logic-core.js";
import { draw } from "./game.js";
import { gameAbandonKey, GameStartEvent, gameStartKey, ThrowsEvent, throwsKey, WhoseTurnEvent, whoseTurnKey } from "../shared/events/game-events.js";
import { renderObjects } from "./render-core.js";
import DebugGameOverview from "./objects/debug-game-overview.js";
import { setInCheck, setIsMyTurn } from "./logic/whose-turn-is-it.js";
import { myTiles, opponentTiles } from "../shared/logic/lineup.js";
import { hideOverlay } from "./utils/overlay.js";

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
    const event: JoinRoomEvent = { roomId, username };
    clientIO.emit("join-room", event)
}

clientIO.on("<-join-room", (event: JoinRoomResponse) => {
    if (event.success) {

    } else {
        clientIO.disconnect()
        alert("Failed to join room")
        // TODO: send back to main page
    }
})

export function emitMoveTile(tile: Tile, field: Field) {
    const event: TileMoveEvent = { tileId: tile.id, field: { x: field.x, y: field.y } }
    clientIO.emit("move-tile", event)
}

clientIO.on("<-move-tile", (event: TileMoveResponse) => {
    doTileMove(gameBoard, event)
    draw()
})

clientIO.on(gameStartKey, (event: GameStartEvent) => {
    renderObjects.push(new DebugGameOverview(event))
    setIsMyTurn(event, true)
    hideOverlay()
})

clientIO.on(gameAbandonKey, () => {
    window.location.search = `roomId=${roomId}&username=${username}`
})

clientIO.on("disconnect", () => {
    window.location.search = `roomId=${roomId}&username=${username}`
})

clientIO.on(whoseTurnKey, (event: WhoseTurnEvent) => {
    setIsMyTurn(event)
})

clientIO.on(checkStatusKey, (event: CheckStatusEvent) => {
    setInCheck(event)
})

export function emitPassChainJump() {
    clientIO.emit(passChainJumpKey)
}

clientIO.on(throwsKey, (event: ThrowsEvent) => {
    event.actions.forEach(action => {
        const isMyVictim = !action.thrower.isMyTile
        const victimTile = (isMyVictim ? myTiles : opponentTiles).find(it => it.id == action.victim.tile)!!

        victimTile.setThrown()
        console.log(`${isMyVictim ? "My" : "Opponent"} tile ${victimTile.id} was thrown by ${action.thrower.tile}`)
    })
})