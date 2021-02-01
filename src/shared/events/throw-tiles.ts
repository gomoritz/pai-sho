export const ThrowTilesEvent = "throw-tiles"

export interface ThrowTilesPacket {
    actions: ThrownTile[]
}

export interface ThrownTile {
    thrower: {
        isMyTile: boolean
        tile: string
    }
    victim: {
        tile: string
    }
}