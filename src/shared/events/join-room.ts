export const JoinRoomEvent = "join-room"
export const JoinRoomResponseEvent = "<-join-room"

export interface JoinRoomPacket {
    roomId: string
    username: string
}

export interface JoinRoomResponsePacket {
    success: boolean
}