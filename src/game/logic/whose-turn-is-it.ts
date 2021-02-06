import DebugGameOverview from "../objects/debug-game-overview.js";
import { draw } from "../game.js";
import Field from "../../shared/logic/field.js";
import { gameBoard } from "../logic-core.js";
import { emitPassChainJump } from "../client-core.js";
import { Tile } from "../../shared/logic/tiles.js";
import { GameStartPacket } from "../../shared/events/game-start.js";
import { WhoseTurnPacket } from "../../shared/events/whose-turn.js";
import { InCheckPacket } from "../../shared/events/in-check.js";
import { showActionBar, showWhoseTurn } from "../utils/user-interface.js";

const passButton = document.getElementById("pass-chain-jump") as HTMLButtonElement
passButton.addEventListener("click", () => emitPassChainJump())

let myTurn: boolean | null = null
let inCheck: boolean = false

let chainJumps: Field[] | null = null
let tileWhichChainJumps: string | null = null

export function isMyTurn(): boolean {
    return myTurn!!
}

export function isInCheck(): boolean {
    return inCheck
}

export function setIsMyTurn(packet: WhoseTurnPacket | GameStartPacket, isGameStart: boolean = false) {
    if (myTurn == packet.myTurn && myTurn && !isGameStart) {
        const wte = packet as WhoseTurnPacket;
        if (wte.chainJumps) {
            showPlayAgain()
            chainJumps = wte.chainJumps.map(obj => gameBoard.getField(obj.x, obj.y)!!)
            tileWhichChainJumps = wte.tileWhichChainJumps!!
            passButton.style.display = "block"
            passButton.classList.add("pass-chain-shown")
        }
    } else {
        myTurn = packet.myTurn
        showWhoseTurn(myTurn)

        chainJumps = null
        tileWhichChainJumps = null
        passButton.classList.remove("pass-chain-shown")
        setTimeout(() => passButton.style.display = "block", 300)

        DebugGameOverview.getInstance().state.myTurn = myTurn
        draw()
    }
}

export function setInCheck(packet: InCheckPacket) {
    inCheck = packet.inCheck
    draw()
}

export function verify(tile: Tile, field: Field): boolean {
    return verifyChainJumps(tile, field)
}

/**
 * If the player is allowed to perform a chain-jump, this function makes sure that
 * the given field is a potential target of such a chain-jump. If no chain-jumps
 * are available, this function returns true for all fields.
 */
function verifyChainJumps(tile: Tile, field: Field): boolean {
    return chainJumps == null || (chainJumps.some(cj => field.equals(cj)) && tile.id == tileWhichChainJumps)
}

function showPlayAgain() {
    // only show the first time
    if (chainJumps == null) showActionBar("Springe nochmal!")
}