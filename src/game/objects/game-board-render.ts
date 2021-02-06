import RenderObject from "./render-object.js";
import { canvas, ctx, isDebug } from "../game.js";
import { brown, red, white } from "../utils/colors.js";
import { drawTriangle } from "../shapes/triangle.js";
import {
    gameBoardRadius,
    innerBorder,
    innerTrianglesHeight,
    lineGap,
    lineStroke,
    outerBorder, scale,
    shadowGradientInnerRadius,
    shadowGradientOuterRadius,
    shadowOffsetX,
    shadowOffsetY
} from "../../shared/utils/dimensions.js";
import Point, { subtract } from "../../shared/utils/point.js";
import { offsetX, offsetY } from "../logic/camera.js";

export default class GameBoardRender extends RenderObject {
    public center: Point

    render = () => {
        this.center = {
            x: canvas.width / 2 + offsetX,
            y: canvas.height / 2 + offsetY
        }

        this.drawDecoration()

        this.clipGameBoardCircle()

        this.fillBackground()
        this.drawInnerTriangles()
        this.drawOuterTriangles()
        this.drawGrid()

        this.resetClip()
    }

    drawDecoration() {
        const dx = shadowOffsetX
        const dy = shadowOffsetY
        const gradient = ctx.createRadialGradient(this.center.x + dx, this.center.y + dy, shadowGradientInnerRadius,
            this.center.x + dx, this.center.y + dy, shadowGradientOuterRadius)
        gradient.addColorStop(0, "rgba(0,0,0,0.8)")
        gradient.addColorStop(0.75, "rgba(0,0,0,0.01)")
        gradient.addColorStop(1.0, "rgba(0,0,0,0.0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.center.x + dx, this.center.y + dy, shadowGradientOuterRadius + dx + dy, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#e4b265"
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, outerBorder, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#c68b55"
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, innerBorder, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, gameBoardRadius + lineStroke, 0, Math.PI * 2)
        ctx.fill()
    }

    clipGameBoardCircle() {
        ctx.save()
        ctx.beginPath()
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
            { x: x - innerTrianglesHeight, y: y + innerTrianglesHeight },
            { x: x + innerTrianglesHeight, y: y + innerTrianglesHeight },
            red)
        drawTriangle(
            this.center,
            { x: x - innerTrianglesHeight, y: y - innerTrianglesHeight },
            { x: x + innerTrianglesHeight, y: y - innerTrianglesHeight },
            red)
        drawTriangle(
            this.center,
            { x: x + innerTrianglesHeight, y: y - innerTrianglesHeight },
            { x: x + innerTrianglesHeight, y: y + innerTrianglesHeight },
            white)
        drawTriangle(
            this.center,
            { x: x - innerTrianglesHeight, y: y - innerTrianglesHeight },
            { x: x - innerTrianglesHeight, y: y + innerTrianglesHeight },
            white)
    }

    drawOuterTriangles() {
        const { y, x } = this.center;

        drawTriangle(
            { x: x + innerTrianglesHeight, y: y + innerTrianglesHeight },
            { x: x + innerTrianglesHeight, y: y + innerTrianglesHeight * 2 },
            { x: x + innerTrianglesHeight * 2, y: y + innerTrianglesHeight },
            red)
        drawTriangle(
            { x: x - innerTrianglesHeight, y: y + innerTrianglesHeight },
            { x: x - innerTrianglesHeight, y: y + innerTrianglesHeight * 2 },
            { x: x - innerTrianglesHeight * 2, y: y + innerTrianglesHeight },
            red)
        drawTriangle(
            { x: x + innerTrianglesHeight, y: y - innerTrianglesHeight },
            { x: x + innerTrianglesHeight, y: y - innerTrianglesHeight * 2 },
            { x: x + innerTrianglesHeight * 2, y: y - innerTrianglesHeight },
            red)
        drawTriangle(
            { x: x - innerTrianglesHeight, y: y - innerTrianglesHeight },
            { x: x - innerTrianglesHeight, y: y - innerTrianglesHeight * 2 },
            { x: x - innerTrianglesHeight * 2, y: y - innerTrianglesHeight },
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
        } else {
            ctx.strokeStyle = "#000"
        }

        ctx.lineWidth = lineStroke

        for (let i = 0; i < 9; i++) {
            const lineOffset = i * lineGap

            ctx.beginPath()
            ctx.moveTo(this.center.x - gameBoardRadius + lineOffset, this.center.y - gameBoardRadius)
            ctx.lineTo(this.center.x + gameBoardRadius, this.center.y + gameBoardRadius - lineOffset)
            ctx.stroke()

            ctx.fillText("x=" + -i, this.center.x + gameBoardRadius + 5, this.center.y + gameBoardRadius - lineOffset + 10)

            if (i == 0) continue

            ctx.beginPath()
            ctx.moveTo(this.center.x - gameBoardRadius, this.center.y - gameBoardRadius + lineOffset)
            ctx.lineTo(this.center.x + gameBoardRadius - lineOffset, this.center.y + gameBoardRadius)
            ctx.stroke()

            ctx.fillText("x=" + i, this.center.x - gameBoardRadius - 55, this.center.y - gameBoardRadius + lineOffset + 5)
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

            ctx.fillText("y=" + -i, this.center.x + gameBoardRadius - lineOffset - 15, this.center.y - gameBoardRadius - 10)

            if (i == 0) continue

            ctx.beginPath()
            ctx.moveTo(this.center.x + gameBoardRadius, this.center.y - gameBoardRadius + lineOffset)
            ctx.lineTo(this.center.x - gameBoardRadius + lineOffset, this.center.y + gameBoardRadius)
            ctx.stroke()

            ctx.fillText("y=" + i, this.center.x - gameBoardRadius + lineOffset - 25, this.center.y + gameBoardRadius + 23)
        }

        if (isDebug) this.clipGameBoardCircle()
    }

    relativeToCenter(point: Point): Point {
        return subtract(point, this.center)
    }
}