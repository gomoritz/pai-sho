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
        canvas.addEventListener("mousedown", handleMouseDown)
        canvas.addEventListener("mouseup", handleMouseUp)
    } else {
        canvas.addEventListener("click", handleMouseClick)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
}

export function removeListeners() {
    canvas.removeEventListener("mousemove", handleMouseMove)
    canvas.removeEventListener("mousedown", handleMouseDown)
    canvas.removeEventListener("mouseup", handleMouseUp)
    canvas.removeEventListener("mouseclick", handleMouseClick)
}

function handleMouseMove(event: MouseEvent) {
    if (movingTile != null && movingMode == "drag") {
        movingTile.dragPosition = { x: event.clientX, y: event.clientY }
        draw()
    } else {
        const center = gameBoardRenderer.center
        const relativePoint = subtract({ x: event.clientX, y: event.clientY }, center)
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
                const { x, y } = { x: event.clientX + 15, y: event.clientY + 30 }

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

function handleMouseDown(event: MouseEvent) {
    if (hoveredTile != null) {
        setDraggingTile(hoveredTile, { x: event.clientX, y: event.clientY })
        clearHoveredTile()
    }
}

function handleMouseUp(_: MouseEvent) {
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