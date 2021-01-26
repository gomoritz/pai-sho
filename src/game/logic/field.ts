import { gameBoard } from "../logic-core.js";
import { ctx } from "../game.js";
import { gameBoardRenderer } from "../render-core.js";
import { Direction } from "./direction.js";
import Point from "../shapes/point.js";

export default class Field {
    constructor(public x: number, public y: number) {
    }

    /**
     * Translates this field location to a point relative to the center of the screen.
     * Returns null if the field doesn't exist because it is outside of the game board.
     */
    translateToPoint(): Point | null {
        return gameBoard.getRealCoordinatesRelativeToCenter(this.x, this.y)
    }

    toString(): string {
        return `Field(x=${this.x},y=${this.y})`
    }

    getRelativeField(direction: Direction, distance: number = 1): Field | null {
        switch (direction) {
            case Direction.TOP:
                return gameBoard.getField(this.x + distance, this.y + distance)
            case Direction.TOP_RIGHT:
                return gameBoard.getField(this.x + distance, this.y)
            case Direction.RIGHT:
                return gameBoard.getField(this.x + distance, this.y - distance)
            case Direction.BOTTOM_RIGHT:
                return gameBoard.getField(this.x, this.y - distance)
            case Direction.BOTTOM:
                return gameBoard.getField(this.x - distance, this.y - distance)
            case Direction.BOTTOM_LEFT:
                return gameBoard.getField(this.x - distance, this.y)
            case Direction.LEFT:
                return gameBoard.getField(this.x - distance, this.y + distance)
            case Direction.TOP_LEFT:
                return gameBoard.getField(this.x, this.y + distance)
        }
        return null
    }

    highlight() {
        const { x, y } = this.translateToPoint()!!
        const center = gameBoardRenderer.center

        ctx.fillStyle = "#FF0000"
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.arc(center.x + x, center.y + y, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}