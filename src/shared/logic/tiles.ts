import Point, { subtract } from "../utils/point.js";
import Field from "./field.js";
import GameBoard from "./game-board.js";
import TileRenderer from "../../game/objects/tile-renderer.js";
import { myTiles, opponentTiles } from "./lineup.js";
import { tileSize } from "../utils/dimensions.js";
import { calculateAllPossibleMoves } from "./tile-moves.js";

export abstract class Tile {
    public field: Field | null
    public isThrown = false

    public renderer: TileRenderer

    public isHovered: boolean = false
    public isClicked: boolean = false;

    protected constructor(public imageResource: string, public id: string, public isDark: boolean) {
    }

    setThrown() {
        this.isThrown = true
        this.isHovered = false
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
        return diagonal <= tileSize / 2
    }

    atField(gameBoard: GameBoard, x: number, y: number): this {
        this.field = gameBoard.getField(x, y)!!
        this.field.tile = this
        return this
    }

    equals(other: Tile | null): boolean {
        if (other == null) return false
        return other.id == this.id && other.isDark == this.isDark
    }

    serialize(): string {
        return this.id
    }

    getTilesWhichCouldThrow(): Tile[] {
        const candidates = this.isDark ? myTiles : opponentTiles
        const result: Tile[] = []

        for (let tile of candidates) {
            const possibleFields = tile.getFieldsForPossibleMoves()
            for (let field of possibleFields) {
                const throws = field.getNeighbourFields().filter(other => other.tile != null
                    && other.tile == this && other.tile.canThrow(this))

                if (throws.length > 0) {
                    result.push(tile)
                    break
                }
            }
        }

        return result
    }

    getFieldsForPossibleMoves() {
        return calculateAllPossibleMoves(this)
    }

    get gameBoard() {
        return this.field?.gameBoard
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

    getTileByWhichInCheck(): Tile | null {
        return this.field?.getNeighbourFields()
            .find(field => field.tile != null && field.tile.isDark != this.isDark)
            ?.tile ?? null
    }

    isInCheckMate(): boolean {
        const checkBy = this.getTileByWhichInCheck();
        if (checkBy == null) return false

        const canEscape = this.field?.getNeighbourFields().every(field => field.tile == null && !field.wouldBeInCheck(this)) ?? true;
        const canThrowOpponent = (checkBy.getTilesWhichCouldThrow()?.length ?? []) > 0
        return !canEscape && !canThrowOpponent
    }

    bringsVictory(): boolean {
        return this.field?.x == 0 && this.field.y == 0 && this.getTileByWhichInCheck() == null
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