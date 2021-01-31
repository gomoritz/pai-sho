export const gameStartKey = "game-start"
export interface GameStartEvent {
    role: "a" | "b"
    myTurn: boolean
    players: {
        a: string
        b: string
    }
}

export const whoseTurnKey = "whose-turn"
export interface WhoseTurnEvent {
    myTurn: boolean
    chainJumps?: { x: number, y: number }[]
}

export const throwsKey = "throws"
export interface ThrowsEvent {
    actions: ThrowAction[]
}
export interface ThrowAction {
    thrower: {
        isMyTile: boolean
        tile: string
    }
    victim: {
        tile: string
    }
}