import GameBoardRender from "./objects/game-board-render.js";
import RenderObject from "./objects/render-object.js";

export const gameBoardRenderer = new GameBoardRender()

const renderObjects: RenderObject[] = [gameBoardRenderer]

export function renderCanvas() {
    renderObjects.forEach(obj => obj.render())
}