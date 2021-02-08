import GameBoard from "../../shared/logic/game-board.js";
import { createTileListeners } from "./logic/tile-interaction.js"
import { renderObjects } from "./render-core.js";
import TileRenderer from "./objects/tile-renderer.js";
import { createCameraListeners } from "./logic/camera.js";

export const gameBoard = new GameBoard()

export function initLogic() {
    console.log("[Logic] Pai Sho game logic initialized")
    gameBoard.loadFields()

    gameBoard.lineup.buildLineup().forEach(tile => {
        const tileRenderer = new TileRenderer(tile)
        tile.renderer = tileRenderer
        renderObjects.push(tileRenderer);
    })

    createTileListeners()
    createCameraListeners()
}