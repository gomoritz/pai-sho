import RenderObject from "./render-object.js";
import { canvas, ctx } from "../game.js";
import { brown, red, white } from "../utils/colors.js";
import { drawTriangle } from "../shapes/triangle.js";

const gameBoardRadius = 380
const innerHeight = 210

export default class GameBoard implements RenderObject {
    private center: Point

    render() {
        this.center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        this.clipGameBoardCircle()

        this.fillBackground()
        this.drawInnerTriangles()
        this.drawOuterTriangles()
        this.drawGrid()

        this.resetClip()
    }

    clipGameBoardCircle() {
        ctx.arc(this.center.x, this.center.y, gameBoardRadius, 0, Math.PI * 2)
        ctx.clip()
    }

    resetClip() {
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.clip()
    }

    fillBackground() {
        ctx.fillStyle = brown
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    drawInnerTriangles() {
        const { y, x } = this.center;

        drawTriangle(
            this.center,
            { x: x - innerHeight, y: y + innerHeight },
            { x: x + innerHeight, y: y + innerHeight },
            red)
        drawTriangle(
            this.center,
            { x: x - innerHeight, y: y - innerHeight },
            { x: x + innerHeight, y: y - innerHeight },
            red)
        drawTriangle(
            this.center,
            { x: x + innerHeight, y: y - innerHeight },
            { x: x + innerHeight, y: y + innerHeight },
            white)
        drawTriangle(
            this.center,
            { x: x - innerHeight, y: y - innerHeight },
            { x: x - innerHeight, y: y + innerHeight },
            white)
    }

    drawOuterTriangles() {
        const { y, x } = this.center;

        drawTriangle(
            { x: x + innerHeight, y: y + innerHeight },
            { x: x + innerHeight, y: y + innerHeight * 2 },
            { x: x + innerHeight * 2, y: y + innerHeight },
            red)
        drawTriangle(
            { x: x - innerHeight, y: y + innerHeight },
            { x: x - innerHeight, y: y + innerHeight * 2 },
            { x: x - innerHeight * 2, y: y + innerHeight },
            red)
        drawTriangle(
            { x: x + innerHeight, y: y - innerHeight },
            { x: x + innerHeight, y: y - innerHeight * 2 },
            { x: x + innerHeight * 2, y: y - innerHeight },
            red)
        drawTriangle(
            { x: x - innerHeight, y: y - innerHeight },
            { x: x - innerHeight, y: y - innerHeight * 2},
            { x: x - innerHeight * 2, y: y - innerHeight },
            red)
    }

    drawGrid() {
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 4

        for (let lineOffsetX = -gameBoardRadius * 2 + innerHeight / 7 + 10; lineOffsetX <= gameBoardRadius * 2; lineOffsetX += innerHeight * 2 / 7) {
            ctx.beginPath()
            ctx.moveTo(this.center.x - gameBoardRadius + lineOffsetX, this.center.y - gameBoardRadius)
            ctx.lineTo(this.center.x + gameBoardRadius, this.center.y + gameBoardRadius - lineOffsetX)
            ctx.stroke()
        }

        for (let lineOffsetX = -gameBoardRadius * 2 + innerHeight / 7 + 10; lineOffsetX <= gameBoardRadius * 2; lineOffsetX += innerHeight * 2 / 7) {
            ctx.beginPath()
            ctx.moveTo(this.center.x + gameBoardRadius - lineOffsetX, this.center.y - gameBoardRadius)
            ctx.lineTo(this.center.x - gameBoardRadius, this.center.y + gameBoardRadius - lineOffsetX)
            ctx.stroke()
        }
    }
}