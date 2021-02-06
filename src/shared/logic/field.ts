import { Direction } from "./direction.js";
import Point from "../utils/point.js";
import { LotusTile, Tile } from "./tiles.js";
import GameBoard from "./game-board.js";

export default class Field {
    public tile: Tile | null = null

    constructor(public gameBoard: GameBoard, public x: number, public y: number) {
    }

    /**
     * Translates this field location to a point relative to the center of the screen.
     * Returns null if the field doesn't exist because it is outside of the game board.
     */
    translateToPoint(): Point | null {
        return this.gameBoard.getRealCoordinatesRelativeToCenter(this.x, this.y)
    }

    toString(): string {
        return `Field(x=${this.x},y=${this.y})`
    }

    getRelativeField(direction: Direction, distance: number = 1): Field | null {
        switch (direction) {
            case Direction.TOP:
                return this.gameBoard.getField(this.x + distance, this.y + distance)
            case Direction.TOP_RIGHT:
                return this.gameBoard.getField(this.x + distance, this.y)
            case Direction.RIGHT:
                return this.gameBoard.getField(this.x + distance, this.y - distance)
            case Direction.BOTTOM_RIGHT:
                return this.gameBoard.getField(this.x, this.y - distance)
            case Direction.BOTTOM:
                return this.gameBoard.getField(this.x - distance, this.y - distance)
            case Direction.BOTTOM_LEFT:
                return this.gameBoard.getField(this.x - distance, this.y)
            case Direction.LEFT:
                return this.gameBoard.getField(this.x - distance, this.y + distance)
            case Direction.TOP_LEFT:
                return this.gameBoard.getField(this.x, this.y + distance)
        }
        return null
    }

    isNeighbourField(other: Field): boolean {
        const dx = this.x - other.x;
        const dy = this.y - other.y;

        if (Math.abs(dx) == Math.abs(dy) && Math.abs(dx) == 1) {
            return true
        }

        return Math.abs(dx) + Math.abs(dy) == 1
    }

    getNeighbourFields(): Field[] {
        return [
            this.getRelativeField(Direction.TOP),
            this.getRelativeField(Direction.TOP_RIGHT),
            this.getRelativeField(Direction.RIGHT),
            this.getRelativeField(Direction.BOTTOM_RIGHT),
            this.getRelativeField(Direction.BOTTOM),
            this.getRelativeField(Direction.BOTTOM_LEFT),
            this.getRelativeField(Direction.LEFT),
            this.getRelativeField(Direction.TOP_LEFT),
        ].filter(it => it != null).map(it => it!!)
    }

    getFieldBetween(other: Field): Field | null {
        return this.gameBoard.getField(this.x - (this.x - other.x) / 2, this.y - (this.y - other.y) / 2)
    }

    equals(other: Field | null): boolean {
        if (other == null) return false
        return other.x == this.x && other.y == this.y
    }

    serialize(): { x: number, y: number } {
        return { x: this.x, y: this.y }
    }

    wouldBeInCheck(tile: LotusTile): boolean {
        return this.getNeighbourFields().some(other => other.tile != null && other.tile.isDark != tile.isDark)
    }
}