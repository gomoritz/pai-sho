import { GameStartPacket } from "../../../shared/events/game-start.js";

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
    myNameElement.classList.remove("name-tag-hidden")

    opponentNameElement.innerText = opponentName
    opponentNameElement.classList.remove("name-tag-hidden")
}

export function showWhoseTurn(my: boolean) {
    if (my) {
        myNameElement.classList.add("their-turn")
        opponentNameElement.classList.remove("their-turn")
        showActionBar("Du bist dran!")
    } else {
        opponentNameElement.classList.add("their-turn")
        myNameElement.classList.remove("their-turn")
    }
}

const actionBarElement = document.getElementById("action-bar")!!

export function showActionBar(text: string) {
    actionBarElement.innerText = ""
    actionBarElement.classList.remove("action-bar-animation")
    actionBarElement.style.display = "block"

    setTimeout(() => {
        actionBarElement.innerText = text
        actionBarElement.classList.add("action-bar-animation")
    }, 100)

    setTimeout(() => {
        actionBarElement.style.display = "none"
    }, 1500)
}

export function showGameEnd(win: boolean) {
    if (win) {
        showOverlay("Du hast gewonnen!")
        // @ts-ignore
        confetti({
            particleCount: 200,
            spread: 90,
            angle: 45,
            origin: { x: 0, y: 1 },
        });
        // @ts-ignore
        confetti({
            particleCount: 200,
            spread: 90,
            angle: 135,
            origin: { x: 1, y: 1 },
        });
    } else {
        showOverlay("Du hast verloren!")
    }
}