export interface TileMoveEvent {
    tileId: string
    field: { x: number, y: number }
}

export interface TileMoveResponse extends TileMoveEvent {
    isMoveByMe: boolean
}

export const passChainJumpKey = "pass-chain-jump"