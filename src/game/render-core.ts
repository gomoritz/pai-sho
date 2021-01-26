import { canvas, ctx } from "./game.js";
import { drawTriangle } from "./shapes/triangle.js";

export function renderCanvas() {
    const center: Point = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }

    const gameBoardRadius = 380
    const innerHeight = 210

    const white = "#FFF"
    const red = "#7F0000"
    const brown = "#6B2A00"

    ctx.arc(center.x, center.y, gameBoardRadius, 0, Math.PI * 2)
    ctx.clip()

    ctx.fillStyle = brown
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawTriangle(center, { x: center.x - innerHeight, y: center.y + innerHeight }, { x: center.x + innerHeight, y: center.y + innerHeight}, red)
    drawTriangle(center, { x: center.x - innerHeight, y: center.y - innerHeight }, { x: center.x + innerHeight, y: center.y - innerHeight}, red)
    drawTriangle(center, { x: center.x + innerHeight, y: center.y - innerHeight }, { x: center.x + innerHeight, y: center.y + innerHeight }, white)
    drawTriangle(center, { x: center.x - innerHeight, y: center.y - innerHeight }, { x: center.x - innerHeight, y: center.y + innerHeight }, white)

    drawTriangle({
        x: center.x + innerHeight,
        y: center.y + innerHeight
    }, {
        x: center.x + innerHeight,
        y: center.y + innerHeight * 2
    }, {
        x: center.x + innerHeight * 2,
        y: center.y + innerHeight
    }, red)

    drawTriangle({
        x: center.x - innerHeight,
        y: center.y + innerHeight
    }, {
        x: center.x - innerHeight,
        y: center.y + innerHeight * 2
    }, {
        x: center.x - innerHeight * 2,
        y: center.y + innerHeight
    }, red)

    drawTriangle({
        x: center.x + innerHeight,
        y: center.y - innerHeight
    }, {
        x: center.x + innerHeight,
        y: center.y - innerHeight * 2
    }, {
        x: center.x + innerHeight * 2,
        y: center.y - innerHeight
    }, red)

    drawTriangle({
        x: center.x - innerHeight,
        y: center.y - innerHeight
    }, {
        x: center.x - innerHeight,
        y: center.y - innerHeight * 2
    }, {
        x: center.x - innerHeight * 2,
        y: center.y - innerHeight
    }, red)

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 4

    for (let lineOffsetX = -gameBoardRadius * 2 + innerHeight / 7 + 10; lineOffsetX <= gameBoardRadius * 2; lineOffsetX += innerHeight * 2 / 7) {
        ctx.beginPath()
        ctx.moveTo(center.x - gameBoardRadius + lineOffsetX, center.y - gameBoardRadius)
        ctx.lineTo(center.x + gameBoardRadius, center.y + gameBoardRadius - lineOffsetX)
        ctx.stroke()
    }

    for (let lineOffsetX = -gameBoardRadius * 2 + innerHeight / 7 + 10; lineOffsetX <= gameBoardRadius * 2; lineOffsetX += innerHeight * 2 / 7) {
        ctx.beginPath()
        ctx.moveTo(center.x + gameBoardRadius - lineOffsetX, center.y - gameBoardRadius)
        ctx.lineTo(center.x - gameBoardRadius, center.y + gameBoardRadius - lineOffsetX)
        ctx.stroke()
    }

    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.clip()
}