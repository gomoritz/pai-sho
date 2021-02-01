export const GameStartEvent = "game-start"

export interface GameStartPacket {
    role: "a" | "b"
    myTurn: boolean
    players: {
        a: string
        b: string
    }
}