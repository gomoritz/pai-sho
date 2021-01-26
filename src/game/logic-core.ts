import GameBoard from "./logic/game-board.js";
import { activateLineup } from "./logic/lineup.js";

export const gameBoard = new GameBoard()

export function initLogic() {
    console.log("[Logic] Pai Sho game logic initialized")
    gameBoard.loadFields()

    activateLineup(true)
    activateLineup(false)
}