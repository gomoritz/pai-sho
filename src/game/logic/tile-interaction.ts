/**
 * This file handles the interaction with the user to move tiles around
 * the game board.
 */

import { Tile } from "./tiles.js";
import { canvas, ctx, draw, isDebug } from "../game.js";
import { gameBoardRenderer } from "../render-core.js";
import Point, { subtract } from "../shapes/point.js";
import { gameBoard } from "../logic-core.js";
import { myTiles } from "./lineup.js";
import { tryTileMove } from "./tile-moves.js";

let movingMode: "drag" | "click" = "drag"

let movingTile: Tile | null = null
let hoveredTile: Tile | null = null

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
                ctx.font = "bold 18px monospace"
                ctx.fillStyle = "#000000FF"
                ctx.fillRect(x, y - 16, ctx.measureText(dbg).width, 20)

                ctx.fillStyle = "#FFFFFFFF"
                ctx.fillText(dbg, x, y)
            }
        }
    }
}

function handleInteractionStart(event: MouseEvent | TouchEvent) {
    const point = parseTouchOrMouse(event)
    const relativePoint = subtract(point, gameBoardRenderer.center)
    const hovered = myTiles.find(tile => tile.isInsideTile(relativePoint))

    if (hovered != null) {
        setDraggingTile(hovered, point)
        clearHoveredTile()
    }
}

function handleInteractionEnd(_: MouseEvent) {
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