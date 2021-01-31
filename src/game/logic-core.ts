import GameBoard from "../shared/logic/game-board.js";
import { buildLineup } from "../shared/logic/lineup.js";
import { createHintRenderer, createTileListeners } from "./logic/tile-interaction.js"
import { renderObjects } from "./render-core.js";
import TileRenderer from "./objects/tile-renderer.js";

export const gameBoard = new GameBoard()

export function initLogic() {
    console.log("[Logic] Pai Sho game logic initialized")
    gameBoard.loadFields()

    buildLineup(gameBoard).forEach(tile => {
        const tileRenderer = new TileRenderer(tile)
        tile.renderer = tileRenderer
        renderObjects.push(tileRenderer);
    })

    createTileListeners()
    createHintRenderer()
}