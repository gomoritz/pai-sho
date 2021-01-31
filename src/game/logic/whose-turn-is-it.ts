import { GameStartEvent, WhoseTurnEvent } from "../../shared/events/game-events.js";
import DebugGameOverview from "../objects/debug-game-overview.js";
import { draw } from "../game.js";
import Field from "../../shared/logic/field.js";
import { gameBoard } from "../logic-core.js";

let myTurn: boolean | null = null

export let chainJumps: Field[] | null = null

export function isMyTurn(): boolean {
    return myTurn!!
}

export function setIsMyTurn(event: WhoseTurnEvent | GameStartEvent, isGameStart: boolean = false) {
    if (myTurn == event.myTurn && !isGameStart) {
        showPlayAgain()
        chainJumps = (event as WhoseTurnEvent).chainJumps!!.map(obj => gameBoard.getField(obj.x, obj.y)!!)
    } else {
        myTurn = event.myTurn
        chainJumps = null
        DebugGameOverview.getInstance().state.myTurn = myTurn
        draw()
    }
}

/**
 * If the player is allowed to perform a chain-jump, this function makes sure that
 * the given field is a potential target of such a chain-jump. If no chain-jumps
 * are available, this function returns true for all fields.
 */
export function verifyChainJumps(field: Field): boolean {
    return chainJumps == null || chainJumps.some(cj => field.equals(cj))
}

function showPlayAgain() {
    console.log("You can play again!")
}