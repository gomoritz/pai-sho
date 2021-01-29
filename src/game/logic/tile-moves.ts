import { LotusTile, Tile } from "./tiles.js";
import Field from "./field.js";

export function tryTileMove(tile: Tile, field: Field): void {
    if (!canMoveTileToField(tile, field)) return

    tile.field.tile = null
    field.tile = tile

    tile.field = field
}

export function canMoveTileToField(tile: Tile, field: Field): boolean {
    const previousField = tile.field;

    // check is occupied
    if (field.tile != null) return false

    if (!previousField.isNeighbourField(field)) {
        const isJump = !(tile instanceof LotusTile) && canPerformJump(tile.field, field)
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