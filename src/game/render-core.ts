import GameBoardRender from "./objects/game-board-render.js";
import RenderObject from "./objects/render-object.js";

export const gameBoardRenderer = new GameBoardRender()

export const renderObjects: RenderObject[] = [gameBoardRenderer]

export function renderCanvas() {
    const deferred: RenderObject[] = []

    renderObjects.forEach(obj => {
        if (obj.requiresDefer()) {
            deferred.push(obj)
        } else {
            obj.render()
        }
    })

    deferred.forEach(obj => obj.render())
}