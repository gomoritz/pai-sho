import GameBoard from "./objects/game-board.js";
import RenderObject from "./objects/render-object.js";

const gameBoard = new GameBoard()

const renderObjects: RenderObject[] = [gameBoard]

export function renderCanvas() {
    renderObjects.forEach(obj => obj.render())
}