export const WhoseTurnEvent = "whose-turn"

export interface WhoseTurnPacket {
    myTurn: boolean
    chainJumps?: { x: number, y: number }[]
    tileWhichChainJumps?: string
}