export const JoinGameEvent = "join-game"
export const JoinGameResponseEvent = "<-join-game"

export interface JoinGamePacket {
    gameKey: string
}

export interface JoinGameResponsePacket {
    success: true
}