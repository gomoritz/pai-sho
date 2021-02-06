import { GameStartPacket } from "../../shared/events/game-start.js";

const element = document.getElementById("overlay")!!;
const textElement = document.getElementById("overlay-text")!!

export function hideOverlay() {
    element.style.opacity = "0"
    setTimeout(() => {
        element.style.display = "none"
    }, 500)
}

export function showOverlay(text?: string) {
    if (text) textElement.innerText = text
    element.style.display = "flex"
    element.style.opacity = "1"
}

export let myName: string
export let opponentName: string

const myNameElement = document.getElementById("my-name")!!
const opponentNameElement = document.getElementById("opponent-name")!!

export function setNames(packet: GameStartPacket) {
    myName = packet.role == "a" ? packet.players.a : packet.players.b
    opponentName = packet.role == "a" ? packet.players.b : packet.players.a

    myNameElement.innerText = myName
    myNameElement.classList.remove("my-name-hidden")

    opponentNameElement.innerText = opponentName
    opponentNameElement.classList.remove("opponent-name-hidden")
}

export function showWhoseTurn(my: boolean) {
    if (my) {
        myNameElement.classList.add("their-turn")
        opponentNameElement.classList.remove("their-turn")
    } else {
        opponentNameElement.classList.add("their-turn")
        myNameElement.classList.remove("their-turn")
    }
}