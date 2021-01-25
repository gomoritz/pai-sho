import { canvas, ctx } from "./game.js";
import { drawTriangle } from "./shapes/triangle.js";

export function renderCanvas() {
    const center: Point = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }

    const circleRadius = 380
    const gameBoardSize = 410
    const innerHeight = 210

    const white = "#FFF"
    const red = "#7F0000"
    const brown = "#6B2A00"
    const gameBoardBackground = "#000000"

    ctx.fillStyle = gameBoardBackground
    ctx.fillRect(center.x - gameBoardSize, center.y - gameBoardSize, gameBoardSize * 2, gameBoardSize * 2)

    ctx.arc(center.x, center.y, circleRadius, 0, Math.PI * 2)
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

    for (let lineOffsetX = -gameBoardSize * 2 + innerHeight / 7 + 10; lineOffsetX <= gameBoardSize * 2; lineOffsetX += innerHeight * 2 / 7) {
        ctx.beginPath()
        ctx.moveTo(center.x - gameBoardSize + lineOffsetX, center.y - gameBoardSize)
        ctx.lineTo(center.x + gameBoardSize, center.y + gameBoardSize - lineOffsetX)
        ctx.stroke()
    }

    for (let lineOffsetX = -gameBoardSize * 2 + innerHeight / 7 + 10; lineOffsetX <= gameBoardSize * 2; lineOffsetX += innerHeight * 2 / 7) {
        ctx.beginPath()
        ctx.moveTo(center.x + gameBoardSize - lineOffsetX, center.y - gameBoardSize)
        ctx.lineTo(center.x - gameBoardSize, center.y + gameBoardSize - lineOffsetX)
        ctx.stroke()
    }

    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.clip()
}