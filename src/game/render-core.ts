import GameBoardRender from "./objects/game-board-render.js";
import RenderObject from "./objects/render-object.js";
import { HintRenderer } from "./objects/hint-renderer.js";

export const gameBoardRenderer = new GameBoardRender()
export const hintRenderer = new HintRenderer()

export const renderObjects: RenderObject[] = [gameBoardRenderer, hintRenderer]

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