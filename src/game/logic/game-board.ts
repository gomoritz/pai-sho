import { gameBoardRadius, lineGap } from "../utils/dimensions.js";
import Field from "./field.js";
import Point, { distanceBetween } from "../shapes/point.js";

export default class GameBoard {
    public fields: { [coordinate: string]: Field }

    getRealCoordinatesRelativeToCenter(fieldX: number, fieldY: number): Point | null {
        const functionXForFieldX = (x: number) => -x + (lineGap * fieldX)
        //const functionXForFieldY = (x: number) =>  x + (gameBoard.lineGap * -fieldY)

        // calculate intersection of functionXForFieldX and functionXForFieldY
        const y = ((lineGap * fieldX) - (lineGap * -fieldY)) / 2
        const x = functionXForFieldX(y)
        const point = { x: x, y: -y }

        return this.isInsideGrid(point) ? point : null
    }

    isInsideGrid(point: Point) {
        const diagonal = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2))
        return diagonal <= gameBoardRadius
    }

    loadFields() {
        this.fields = {}
        for (let fieldX = -8; fieldX <= 8; fieldX++) {
            for (let fieldY = -8; fieldY <= 8; fieldY++) {
                const field = new Field(fieldX, fieldY)
                if (field.translateToPoint() == null) continue
                this.fields[`${fieldX};${fieldY}`] = field
            }
        }
    }

    getField(fieldX: number, fieldY: number): Field | null {
        return this.fields[`${fieldX};${fieldY}`] ?? null
    }

    /**
     * Returns the closest field to the given point which must be relative to the
     * game board center or null if there is no field which is closer than 20 pixels
     * away from the point.
     */
    getClosestField(point: Point): Field | null {
        const closest = Object.values(this.fields).find(field => {
            const position = field.translateToPoint()!!
            const distance = distanceBetween(point, position)
            return distance < 20
        })

        return closest ?? null
    }
}