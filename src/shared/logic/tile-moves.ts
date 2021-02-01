import { LotusTile, Tile } from "./tiles.js";
import Field from "./field.js";
import { myTiles, opponentTiles } from "./lineup.js";
import GameBoard from "./game-board.js";
import { TileMoveResponsePacket } from "../events/tile-move.js";

export function doTileMove(gameBoard: GameBoard, event: TileMoveResponsePacket) {
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

    // lotus tile moves into check
    if (tile instanceof LotusTile && field.wouldBeInCheck(tile)) return false

    if (!previousField.isNeighbourField(field)) {
        const isJump = canPerformJump(tile, tile.field!!, field)
        if (!isJump) return false
    }

    return true
}

export function canPerformJump(tile: Tile, origin: Field, target: Field): boolean {
    if (tile instanceof LotusTile) return false

    const dx = Math.abs(origin.x - target.x);
    const dy = Math.abs(origin.y - target.y);
    const distance = dx + dy

    if (distance == 2 || (dx == 2 && dy == 2)) {
        const fieldBetween = origin.getFieldBetween(target)
        return fieldBetween != null && fieldBetween.tile != null
            && fieldBetween.tile.isDark == tile.isDark // cannot jump over opponent tiles
            && !(fieldBetween.tile instanceof LotusTile) // cannot jump over lotus tile
    }

    return false
}