import { canvas, draw, setCanvasDimensions } from "../game.js";
import { hoveredTile } from "./tile-interaction.js";
import { gameBoardRadius, scale } from "../../shared/utils/dimensions.js";

let isShifting: boolean = false

export let zoomLevel = 100
export let offsetX = 0
export let offsetY = 0

function zoom(value: number) {
    zoomLevel += value
    zoomLevel = Math.min(zoomLevel, 250)
    zoomLevel = Math.max(zoomLevel, 100)

    setCanvasDimensions()
}

function shift(x: number, y: number) {
    offsetX += x
    offsetY += y

    offsetX = Math.min(offsetX, (canvas.width * scale) / 2 - gameBoardRadius / scale)
    offsetX = Math.max(offsetX, (-canvas.width * scale) / 2 + gameBoardRadius / scale)

    offsetY = Math.min(offsetY, (canvas.height * scale) / 2 - gameBoardRadius / scale)
    offsetY = Math.max(offsetY, (-canvas.height * scale) / 2 + gameBoardRadius / scale)

    draw()
}

export function createCameraListeners() {
    canvas.addEventListener("mousewheel", updateZoom)

    canvas.addEventListener("mousedown", onMouseDown)
    canvas.addEventListener("mouseup", onMouseUp)
    canvas.addEventListener("mousemove", updatePosition)
}

function updateZoom(event: WheelEvent) {
    event.preventDefault()
    event.stopPropagation()

    const amount = event.deltaY < 0 ? 10 : -10
    zoom(amount)
}

function updatePosition(event: MouseEvent) {
    if (isShifting) {
        shift(event.movementX, event.movementY)
    }
}

function onMouseDown(event: MouseEvent) {
    if (event.button != 0) return
    if (hoveredTile == null) {
        isShifting = true
    }
}

function onMouseUp(event: MouseEvent) {
    if (event.button != 0) return
    isShifting = false
}