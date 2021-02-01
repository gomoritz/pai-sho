import Point, { subtract } from "../utils/point.js";
import Field from "./field.js";
import GameBoard from "./game-board.js";
import TileRenderer from "../../game/objects/tile-renderer.js";
import { myTiles, opponentTiles } from "./lineup.js";

export const size = 42

export abstract class Tile {
    public field: Field | null
    public isThrown = false

    public renderer: TileRenderer

    public isHovered: boolean = false
    public isBeingDragged: boolean = false
    public isClicked: boolean = false;
    public dragPosition: Point | null = null

    protected constructor(public imageResource: string, public id: string, public isDark: boolean) {
    }

    setThrown() {
        this.isThrown = true
        this.isHovered = false
        this.isBeingDragged = false
        this.isClicked = false
        this.field!!.tile = null
        this.field = null

        if (this.isDark) {
            opponentTiles.splice(opponentTiles.indexOf(this), 1)
        } else {
            myTiles.splice(myTiles.indexOf(this), 1)
        }
    }

    startHover() {
        this.isHovered = true
    }

    endHover() {
        this.isHovered = false
    }

    isInsideTile(point: Point) {
        const myPosition = this.field?.translateToPoint()!!
        const relativePoint = subtract(point, myPosition)

        const diagonal = Math.sqrt(Math.pow(relativePoint.x, 2) + Math.pow(relativePoint.y, 2))
        return diagonal <= size / 2
    }

    atField(gameBoard: GameBoard, x: number, y: number): this {
        this.field = gameBoard.getField(x, y)!!
        this.field.tile = this
        return this
    }

    abstract canThrow(other: Tile): boolean
}

export class LotusTile extends Tile {
    constructor(id: string, isDark: boolean) {
        super("lotus", id, isDark);
    }

    canThrow(other: Tile): boolean {
        return false;
    }

    isInCheck(): boolean {
        return this.field?.getNeighbourFields()
            .some(field => field.tile != null && field.tile.isDark != this.isDark)
            ?? false
    }
}

export class AvatarTile extends Tile {
    constructor(id: string, isDark: boolean) {
        super("avatar", id, isDark);
    }

    canThrow(other: Tile): boolean {
        return !(other instanceof LotusTile);
    }
}

export class AirTile extends Tile {
    constructor(id: string, isDark: boolean) {
        super("air", id, isDark);
    }

    canThrow(other: Tile): boolean {
        return other instanceof WaterTile || other instanceof AvatarTile;
    }
}

export class EarthTile extends Tile {
    constructor(id: string, isDark: boolean) {
        super("earth", id, isDark);
    }

    canThrow(other: Tile): boolean {
        return other instanceof FireTile || other instanceof AvatarTile;
    }
}

export class FireTile extends Tile {
    constructor(id: string, isDark: boolean) {
        super("fire", id, isDark);
    }

    canThrow(other: Tile): boolean {
        return other instanceof AirTile || other instanceof AvatarTile;
    }
}

export class WaterTile extends Tile {
    constructor(id: string, isDark: boolean) {
        super("water", id, isDark);
    }

    canThrow(other: Tile): boolean {
        return other instanceof EarthTile || other instanceof AvatarTile;
    }
}