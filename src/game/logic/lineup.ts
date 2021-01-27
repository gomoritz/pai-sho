import { AirTile, AvatarTile, EarthTile, FireTile, LotusTile, Tile, WaterTile } from "./tiles.js";
import { gameBoardRenderer, renderObjects } from "../render-core.js";
import { canvas, draw } from "../game.js";
import { subtract } from "../shapes/point.js";
import { gameBoard } from "../logic-core.js";

export let myTiles: Tile[] = []
export let opponentTiles: Tile[] = []

let draggingTile: Tile | null = null
let hoveredTile: Tile | null = null

export function buildLineup() {
    placeTilesFor("me")
    placeTilesFor("opponent")

    canvas.addEventListener("mousemove", event => {
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
                    hoveredTile.isHovered = false
                    hoveredTile = null
                    draw()
                }
            } else {
                canvas.style.cursor = "pointer"
                hoveredTile = hovered
                hoveredTile.isHovered = true
                draw()
            }
        }
    })

    canvas.addEventListener("mousedown", event => {
        if (hoveredTile != null) {
            draggingTile = hoveredTile
            draggingTile.isBeingDragged = true
            draggingTile.dragPosition = { x: event.clientX, y: event.clientY }

            hoveredTile.isHovered = false
            hoveredTile = null
        }
    })

    canvas.addEventListener("mouseup", () => {
        if (draggingTile != null) {
            const relative = subtract(draggingTile.dragPosition!!, gameBoardRenderer.center)
            const field = gameBoard.getClosestField(relative)

            if (field != null) {
                draggingTile.field = field
            }

            draggingTile.isBeingDragged = false
            draggingTile = null

            draw()
        }
    })
}

function placeTilesFor(player: "me" | "opponent") {
    const isOpponent = player === "opponent"
    const n = isOpponent ? -1 : 1
    const tiles: Tile[] = [
        new LotusTile().atField(-6 * n, -6 * n),

        new AirTile().atField(-5 * n, -6 * n),
        new WaterTile().atField(-4 * n, -6 * n),
        new EarthTile().atField(-3 * n, -6 * n),
        new FireTile().atField(-2 * n, -6 * n),
        new AirTile().atField(-2 * n, -5 * n),
        new WaterTile().atField(-1 * n, -7 * n),

        new EarthTile().atField(-6 * n, -5 * n),
        new FireTile().atField(-6 * n, -4 * n),
        new AirTile().atField(-6 * n, -3 * n),
        new WaterTile().atField(-6 * n, -2 * n),
        new EarthTile().atField(-5 * n, -2 * n),
        new FireTile().atField(-7 * n, -1 * n),

        new AvatarTile().atField(-4 * n, -4 * n)
    ]

    if (isOpponent) {
        tiles.forEach(it => it.isDark = true)
        opponentTiles = tiles
    } else {
        myTiles = tiles
    }

    renderObjects.push(...tiles)
}