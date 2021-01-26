import RenderObject from "./render-object.js";
import { canvas, ctx, isDebug } from "../game.js";
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
        ctx.save()
        ctx.arc(this.center.x, this.center.y, gameBoardRadius, 0, Math.PI * 2)
        ctx.clip()
    }

    resetClip() {
        ctx.restore()
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

    /**
     * Draws the grid over the game board.
     *
     * If the developer mode is enabled, the circle game board clip is disabled during
     * the drawing process and the coordinates outside of the circle are visible.
     *
     * The blue (falling) lines represent the x-coordinates while the green (rising) lines
     * represent the y-coordinates.
     */
    drawGrid() {
        if (isDebug) {
            this.resetClip()
            ctx.strokeStyle = "#0062FF"
            ctx.fillStyle = "#0062FF"
            ctx.font = "20px monospace"
            ctx.lineWidth = 3
        } else {
            ctx.strokeStyle = "#000"
            ctx.lineWidth = 5
        }

        const lineGap = innerHeight * 2 / 7

        for (let i = 0; i < 9; i++) {
            const lineOffset = i * lineGap

            ctx.beginPath()
            ctx.moveTo(this.center.x - gameBoardRadius + lineOffset, this.center.y - gameBoardRadius)
            ctx.lineTo(this.center.x + gameBoardRadius, this.center.y + gameBoardRadius - lineOffset)
            ctx.stroke()

            ctx.fillText("x=" + i, this.center.x + gameBoardRadius + 5, this.center.y + gameBoardRadius - lineOffset + 10)

            if (i == 0) continue

            ctx.beginPath()
            ctx.moveTo(this.center.x - gameBoardRadius, this.center.y - gameBoardRadius + lineOffset)
            ctx.lineTo(this.center.x + gameBoardRadius - lineOffset, this.center.y + gameBoardRadius)
            ctx.stroke()

            ctx.fillText("x=" + -i, this.center.x - gameBoardRadius - 55, this.center.y - gameBoardRadius + lineOffset + 5)
        }

        if (isDebug) {
            ctx.strokeStyle = "#27C800"
            ctx.fillStyle = "#27C800"
        }

        for (let i = 0; i < 9; i++) {
            const lineOffset = i * lineGap

            ctx.beginPath()
            ctx.moveTo(this.center.x + gameBoardRadius - lineOffset, this.center.y - gameBoardRadius)
            ctx.lineTo(this.center.x - gameBoardRadius, this.center.y + gameBoardRadius - lineOffset)
            ctx.stroke()

            ctx.fillText("y=" + i, this.center.x + gameBoardRadius - lineOffset - 15, this.center.y - gameBoardRadius - 10)

            if (i == 0) continue

            ctx.beginPath()
            ctx.moveTo(this.center.x + gameBoardRadius, this.center.y - gameBoardRadius + lineOffset)
            ctx.lineTo(this.center.x - gameBoardRadius + lineOffset, this.center.y + gameBoardRadius)
            ctx.stroke()

            ctx.fillText("y=" + -i, this.center.x - gameBoardRadius + lineOffset - 25, this.center.y + gameBoardRadius + 23)
        }

        if (isDebug) this.clipGameBoardCircle()
    }
}