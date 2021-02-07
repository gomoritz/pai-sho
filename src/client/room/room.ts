import { JoinRoomEvent, JoinRoomResponseEvent, JoinRoomResponsePacket } from "../../shared/events/join-room.js";
import { PublishLobbyEntitiesEvent, PublishLobbyEntitiesPacket } from "../../shared/events/publish-lobby-entities.js";
import { RedirectToGameEvent, RedirectToGamePacket, StartRoomEvent } from "../../shared/events/start-room.js";
import { ChangeNameEvent } from "../../shared/events/change-name.js";

try {
    const clientIO: SocketIOClient.Socket = io()

    const startElement = document.getElementById("start") as HTMLButtonElement
    const myEntityElement = document.getElementById("my-entity")!!
    const inputElement = myEntityElement.children.item(0) as HTMLInputElement;
    const opponentEntityElement = document.getElementById("opponent-entity")!!
    const paragraphElement = opponentEntityElement.children.item(0) as HTMLParagraphElement;

    const url = new URL(window.location.href)
    const roomId = url.searchParams.get("id")
    let username = localStorage.getItem("pai-sho-username") ?? ("Player" + Math.floor(Math.random() * 899 + 100))

    clientIO.on(JoinRoomResponseEvent, (packet: JoinRoomResponsePacket) => {
        if (packet.success) {
            console.log(`Successfully joined room ${roomId} as ${username}`)
        } else {
            url.search = ""
            url.pathname = "/play"
            window.location.href = url.href
        }
    })

    clientIO.on(PublishLobbyEntitiesEvent, (packet: PublishLobbyEntitiesPacket) => {
        const myEntity = packet.entities.find(it => it.me)
        const opponentEntity = packet.entities.find(it => !it.me)

        startElement.disabled = !myEntity || !opponentEntity

        if (myEntity) {
            username = myEntity.username
            localStorage.setItem("pai-sho-username", username)
            inputElement.value = myEntity.username
            myEntityElement.style.display = "block"
        } else {
            myEntityElement.style.display = "none"
        }

        if (opponentEntity) {
            paragraphElement.innerHTML = opponentEntity.username
            opponentEntityElement.style.display = "block"
        } else {
            opponentEntityElement.style.display = "none"
        }
    })

    clientIO.on(RedirectToGameEvent, (packet: RedirectToGamePacket) => {
        url.search = ""
        url.searchParams.set("game_key", packet.gameKey)
        url.pathname = "/game"
        window.location.href = url.href
    })

    startElement.addEventListener("click", () => {
        clientIO.emit(StartRoomEvent)
    })

    inputElement.addEventListener("blur", () => changeName(inputElement))
    inputElement.addEventListener("keypress", (event) => {
        if (event.key == "Enter") inputElement.blur()
    })

    clientIO.emit(JoinRoomEvent, { roomId, username })

    function changeName(element: HTMLInputElement) {
        if (username != element.value) {
            clientIO.emit(ChangeNameEvent, { newUsername: element.value })
        }
    }
} catch (e) {
    console.error(e)
}