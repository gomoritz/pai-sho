/**
 * This file handles the interaction with the user to move tiles around
 * the game board.
 */

import { Tile } from "../../shared/logic/tiles.js";
import { canvas, ctx, draw, isDebug } from "../game.js";
import { gameBoardRenderer } from "../render-core.js";
import Point, { add, distanceBetween } from "../../shared/utils/point.js";
import { gameBoard } from "../logic-core.js";
import { myTiles } from "../../shared/logic/lineup.js";
import { canMoveTileToField } from "../../shared/logic/tile-moves.js";
import { cancelEvent } from "../utils/events.js";
import Field from "../../shared/logic/field.js";
import { emitMoveTile } from "../client-core.js";
import { isMyTurn, verify } from "./whose-turn-is-it.js";

let closestHintField: Field | null = null

let movingTile: Tile | null = null
let hoveredTile: Tile | null = null

export { closestHintField, movingTile, hoveredTile }

export function createTileListeners() {
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("mousemove", handleMove)
    canvas.addEventListener("contextmenu", cancelEvent)
}

function handleMove(event: MouseEvent) {
    const point = { x: event.clientX, y: event.clientY }

    if (movingTile != null) {
        const relPos = gameBoardRenderer.relativeToCenter(point)

        closestHintField = gameBoard.getClosestField(relPos)
        if (closestHintField && (!canMoveTileToField(movingTile!!, closestHintField) || !verify(movingTile!!, closestHintField)))
            closestHintField = null

        if (closestHintField != null) {
            setCursor(event, "pointer")
        } else {
            setCursor(event, "default")
        }

        draw()
    } else {
        const relativePoint = gameBoardRenderer.relativeToCenter(point)
        const hovered = myTiles.find(tile => tile.isInsideTile(relativePoint))

        if (hovered === undefined || !isMyTurn()) {
            setCursor(event, "default")
            if (hoveredTile != null) {
                clearHoveredTile()
                draw()
            }
        } else {
            setCursor(event, "pointer")
            setHoveredTile(hovered)
            draw()
        }
    }

    if (isDebug) {
        const { x, y } = { x: point.x + 15, y: point.y + 30 }
        const nearestField = Object.values(gameBoard.fields)
            .find(it => distanceBetween(add(gameBoardRenderer.center, it.translateToPoint()!!), point) < 25)

        if (nearestField) {
            draw()
            let dbg = `[${nearestField.x};${nearestField.y}]`;
            if (nearestField.tile) {
                dbg = nearestField.tile.id + dbg
            }

            ctx.font = "bold 16px monospace"
            ctx.fillStyle = "#000000FF"
            ctx.fillRect(x, y - 16, ctx.measureText(dbg).width, 20)

            ctx.fillStyle = "#FFFFFFFF"
            ctx.fillText(dbg, x, y)
        }
    }
}

function handleClick(event: MouseEvent) {
    event.preventDefault()
    if (event.button != 0) return
    if (!isMyTurn()) return

    if (movingTile == null) {
        if (hoveredTile != null) {
            setClickedTile(hoveredTile)
            draw()
        }
    } else {
        const relative = gameBoardRenderer.relativeToCenter({ x: event.clientX, y: event.clientY })
        const field = gameBoard.getClosestField(relative)

        if (field != null) {
            tryTileMove(movingTile, field)
        }

        clearClickedTile()
        draw()
    }
}

function setCursor(event: MouseEvent, state: "pointer" | "default") {
    if ("sourceCapabilities" in event) {
        const source = (event as { sourceCapabilities: { firesTouchEvents: boolean } }).sourceCapabilities
        if (source.firesTouchEvents) {
            canvas.style.cursor = "default"
            return
        }
    }

    canvas.style.cursor = state
}

export function tryTileMove(tile: Tile, field: Field) {
    if (!canMoveTileToField(tile, field) || !verify(tile, field)) return

    emitMoveTile(tile, field)
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