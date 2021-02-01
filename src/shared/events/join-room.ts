export const JoinRoomEvent = "join-room"
export const JoinRoomResponseEvent = "<-join-room"

export interface JoinRoomPacket {
    roomId: string
    username: string
}

export type JoinRoomResponsePacket = JoinRoomResponseSuccess | JoinRoomResponseError

export interface JoinRoomResponseSuccess {
    success: true
}

export interface JoinRoomResponseError {
    success: false
}