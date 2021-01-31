import { LotusTile, Tile } from "./tiles.js";
import Field from "./field.js";
import { TileMoveResponse } from "../events/move-events.js";
import { myTiles, opponentTiles } from "./lineup.js";
import GameBoard from "./game-board.js";

export function doTileMove(gameBoard: GameBoard, event: TileMoveResponse) {
    const tile = (event.isMoveByMe ? myTiles : opponentTiles).find(it => it.id == event.tileId)
    const field = gameBoard.getField(event.field.x, event.field.y)
    if (tile == null || field == null) return

    tile.field!!.tile = null
    tile.field = field
    field.tile = tile
}

export function canMoveTileToField(tile: Tile, field: Field): boolean {
    const previousField = tile.field!!;

    // check is occupied
    if (field.tile != null) return false

    if (!previousField.isNeighbourField(field)) {
        const isJump = !(tile instanceof LotusTile) && canPerformJump(tile.field!!, field)
        if (!isJump) return false
    }

    return true
}

function canPerformJump(origin: Field, target: Field): boolean {
    const dx = Math.abs(origin.x - target.x);
    const dy = Math.abs(origin.y - target.y);
    const distance = dx + dy

    if (distance == 2 || (dx == 2 && dy == 2)) {
        const fieldBetween = origin.getFieldBetween(target)
        return fieldBetween != null && fieldBetween.tile != null && !fieldBetween.tile.isDark
    }

    return false
}