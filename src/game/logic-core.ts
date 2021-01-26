import GameGrid from "./logic/game-grid.js";

export const gameGrid = new GameGrid()

export function initLogic() {
    console.log("[Logic] Pai Sho game logic initialized")
    gameGrid.loadFields()
}