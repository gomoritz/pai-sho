export const TileMoveEvent = "tile-move"
export const TileMoveResponseEvent = "<-tile-move"

export interface TileMovePacket {
    tileId: string
    field: { x: number, y: number }
}

export interface TileMoveResponsePacket extends TileMovePacket {
    isMoveByMe: boolean
}