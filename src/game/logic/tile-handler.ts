import { Tile } from "./tiles.js";
import { canvas, draw } from "../game.js";
import { gameBoardRenderer } from "../render-core.js";
import Point, { subtract } from "../shapes/point.js";
import { gameBoard } from "../logic-core.js";
import { myTiles } from "./lineup.js";

let draggingTile: Tile | null = null
let hoveredTile: Tile | null = null

export function createTileListeners() {
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
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

    draggingTile = newTile
    draggingTile.isBeingDragged = true
    draggingTile.dragPosition = dragPosition
}

function clearDraggingTile() {
    if (draggingTile != null) {
        draggingTile.isBeingDragged = false
        draggingTile.dragPosition = null
        draggingTile = null
    }
}

function handleMouseMove(event: MouseEvent) {
    const center = gameBoardRenderer.center
    const relativePoint = subtract({ x: event.clientX, y: event.clientY }, center)

    const hovered = myTiles.find(tile => tile.isInsideTile(relativePoint))

    if (draggingTile != null) {
        draggingTile.dragPosition = { x: event.clientX, y: event.clientY }
        draw()
    } else {
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
    if (draggingTile != null) {
        const relative = subtract(draggingTile.dragPosition!!, gameBoardRenderer.center)
        const field = gameBoard.getClosestField(relative)

        if (field != null) {
            draggingTile.field = field
        }

        clearDraggingTile()
        draw()
    }
}