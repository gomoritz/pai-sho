export interface JoinRoomEvent {
    roomId: string
    username: string
}

export type JoinRoomResponse = JoinRoomResponseSuccess | JoinRoomResponseError

export interface JoinRoomResponseSuccess {
    success: true
}

export interface JoinRoomResponseError {
    success: false
}