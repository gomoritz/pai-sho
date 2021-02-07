export const StartRoomEvent = "start-room"

export const RedirectToGameEvent = "redirect-to-game"

export interface RedirectToGamePacket {
    gameKey: string
}