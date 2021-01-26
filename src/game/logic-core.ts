import GameBoard from "./logic/game-board.js";

export const gameBoard = new GameBoard()

export function initLogic() {
    console.log("[Logic] Pai Sho game logic initialized")
    gameBoard.loadFields()
}