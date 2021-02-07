export const PublishLobbyEntitiesEvent = "publish-lobby-entities"

export interface PublishLobbyEntitiesPacket {
    entities: {
        username: string
        me: boolean
    }[]
}