/**
 * This file handles the interaction with the user to move tiles around
 * the game board.
 */

import { Tile } from "./tiles.js";
import { canvas, ctx, draw, isDebug } from "../game.js";
import { gameBoardRenderer, renderObjects } from "../render-core.js";
import Point, { add, subtract } from "../shapes/point.js";
import { gameBoard } from "../logic-core.js";
import { myTiles } from "./lineup.js";
import { canMoveTileToField, tryTileMove } from "./tile-moves.js";
import RenderObject from "../objects/render-object.js";
import { cancelEvent } from "../utils/events.js";

let movingMode: "drag" | "click" = "drag"

let movingTile: Tile | null = null
let hoveredTile: Tile | null = null

class SuggestionRenderer extends RenderObject {
    render = () => {
        if (movingTile != null) {
            const relPos = subtract(movingTile.dragPosition!!, gameBoardRenderer.center)
            const closestField = gameBoard.getClosestField(relPos)

            Object.values(gameBoard.fields)
                .filter(it => canMoveTileToField(movingTile!!, it))
                .forEach(field => {
                    const pos = add(field.translateToPoint()!!, gameBoardRenderer.center)

                    ctx.save()
                    ctx.globalAlpha = .4
                    movingTile!!.renderTileImage(pos.x - 20, pos.y - 20, 40)
                    ctx.restore()

                    if (field.x == closestField?.x && field.y == closestField.y) {
                        ctx.beginPath()
                        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
                        ctx.fillStyle = "rgba(0,0,0,.3)"
                        ctx.fill()
                        ctx.closePath()
                    }
                })
        }
    }
}

export function createTileListeners() {
    if (movingMode == "drag") {
        canvas.addEventListener("mousedown", handleInteractionStart)
        canvas.addEventListener("mouseup", handleInteractionEnd)

        canvas.addEventListener("touchstart", handleInteractionStart)
        canvas.addEventListener("touchend", handleInteractionEnd)
    } else {
        canvas.addEventListener("click", handleMouseClick)
    }

    canvas.addEventListener("mousemove", handleMove)
    canvas.addEventListener("touchmove", handleMove)
    canvas.addEventListener("contextmenu", cancelEvent)

    renderObjects.push(new SuggestionRenderer())
}

export function removeListeners() {
    canvas.removeEventListener("mousemove", handleMove)
    canvas.removeEventListener("mousedown", handleInteractionStart)
    canvas.removeEventListener("mouseup", handleInteractionEnd)
    canvas.removeEventListener("mouseclick", handleMouseClick)
}

function handleMove(event: MouseEvent | TouchEvent) {
    const point = parseTouchOrMouse(event)

    if (movingTile != null && movingMode == "drag") {
        movingTile.dragPosition = point
        draw()
    } else {
        const relativePoint = subtract(point, gameBoardRenderer.center)
        const hovered = myTiles.find(tile => tile.isInsideTile(relativePoint))

        if (hovered === undefined) {
            canvas.style.cursor = "default"
            if (hoveredTile != null) {
                clearHoveredTile()
                draw()
            }
        } else {
            canvas.style.cursor = "pointer"
            setHoveredTile(hovered)
            draw()

            if (isDebug) {
                const { x, y } = { x: point.x + 15, y: point.y + 30 }

                const dbg = `${hovered.constructor.name}[${hovered.field.x},${hovered.field.y}]`;
                ctx.font = "bold 16px monospace"
                ctx.fillStyle = "#000000FF"
                ctx.fillRect(x, y - 16, ctx.measureText(dbg).width, 20)

                ctx.fillStyle = "#FFFFFFFF"
                ctx.fillText(dbg, x, y)
            }
        }
    }
}

function handleInteractionStart(event: MouseEvent | TouchEvent) {
    if ("button" in event && event.button != 0) return

    const point = parseTouchOrMouse(event)
    const relativePoint = subtract(point, gameBoardRenderer.center)
    const hovered = myTiles.find(tile => tile.isInsideTile(relativePoint))

    if (hovered != null) {
        setDraggingTile(hovered, point)
        clearHoveredTile()
    }
}

function handleInteractionEnd(event: MouseEvent) {
    if ("button" in event && event.button != 0) return

    if (movingTile != null) {
        const relative = subtract(movingTile.dragPosition!!, gameBoardRenderer.center)
        const field = gameBoard.getClosestField(relative)

        if (field != null) {
            tryTileMove(movingTile, field)
        }

        clearDraggingTile()
        draw()
    }
}

function handleMouseClick(event: MouseEvent) {
    if (event.button != 0) return

    if (movingTile == null) {
        if (hoveredTile != null) {
            setClickedTile(hoveredTile)
            draw()
        }
    } else {
        const relative = subtract({ x: event.clientX, y: event.clientY }, gameBoardRenderer.center)
        const field = gameBoard.getClosestField(relative)

        if (field != null) {
            tryTileMove(movingTile, field)
        }

        clearClickedTile()
        draw()
    }
}

function setHoveredTile(newTile: Tile) {
    clearHoveredTile()

    hoveredTile = newTile
    hoveredTile.startHover()
}

function clearHoveredTile() {
    if (hoveredTile != null) {
        hoveredTile.endHover()
        hoveredTile = null
    }
}

function setDraggingTile(newTile: Tile, dragPosition: Point) {
    clearDraggingTile()

    movingTile = newTile
    movingTile.isBeingDragged = true
    movingTile.dragPosition = dragPosition
}

function clearDraggingTile() {
    if (movingTile != null) {
        movingTile.isBeingDragged = false
        movingTile.dragPosition = null
        movingTile = null
    }
}

function setClickedTile(newTile: Tile) {
    clearClickedTile()

    movingTile = newTile
    movingTile.isClicked = true
}

function clearClickedTile() {
    if (movingTile != null) {
        movingTile.isClicked = false
        movingTile = null
    }
}

function parseTouchOrMouse(event: MouseEvent | TouchEvent): Point {
    return "clientX" in event
        ? { x: event.clientX, y: event.clientY }
        : { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
}