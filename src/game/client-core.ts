import { JoinRoomEvent, JoinRoomResponse } from "../shared/events/room-events.js";
import { Tile } from "../shared/logic/tiles.js";
import Field from "../shared/logic/field.js";
import { passChainJumpKey, TileMoveEvent, TileMoveResponse } from "../shared/events/move-events.js";
import { doTileMove } from "../shared/logic/tile-moves.js";
import { gameBoard } from "./logic-core.js";
import { draw } from "./game.js";
import { GameStartEvent, gameStartKey, WhoseTurnEvent, whoseTurnKey } from "../shared/events/game-events.js";
import { renderObjects } from "./render-core.js";
import DebugGameOverview from "./objects/debug-game-overview.js";
import { setIsMyTurn } from "./logic/whose-turn-is-it.js";

export const clientIO: SocketIOClient.Socket = io()

export function connectToServer() {
    const url = new URL(window.location.href);
    const roomId = url.searchParams.get("roomId")
    const username = url.searchParams.get("username")

    if (roomId == null || username == null) {
        clientIO.disconnect()
        alert("Missing request parameters")
        // TODO: send back to main page
        return
    }

    //window.location.search = ""
    emitJoinRoom(roomId, username)
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
})

clientIO.on(whoseTurnKey, (event: WhoseTurnEvent) => {
    setIsMyTurn(event)
})

export function emitPassChainJump() {
    clientIO.emit(passChainJumpKey)
}