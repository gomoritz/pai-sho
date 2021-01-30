import RenderObject from "../objects/render-object.js";
import { ctx } from "../game.js";
import { gameBoardRenderer } from "../render-core.js";
import Point, { add, subtract } from "../shapes/point.js";
import Field from "./field.js";
import { gameBoard } from "../logic-core.js";

export const size = 42

export abstract class Tile extends RenderObject {
    public field: Field | null
    public isThrown = false

    private _isDark: boolean = false
    private imageElement: HTMLImageElement = document.getElementById(this.imageResource) as HTMLImageElement

    public isHovered: boolean = false
    public isBeingDragged: boolean = false
    public isClicked: boolean = false;
    public dragPosition: Point | null = null

    protected constructor(private imageResource: string) {
        super();
    }

    render = () => {
        if (this.isThrown || this.field == undefined) return

        const renderSize = this.isBeingDragged || this.isClicked ? 45 : size
        let { x, y } = add(gameBoardRenderer.center, this.field.translateToPoint()!!)

        if (this.isBeingDragged && this.dragPosition != null) {
            x = this.dragPosition.x
            y = this.dragPosition.y
        }

        const cornerX = x - renderSize / 2
        const cornerY = y - renderSize / 2
        const shadowOffset = this.isBeingDragged || this.isClicked ? 2 : 1

        ctx.fillStyle = "rgba(0,0,0,.7)"
        ctx.beginPath()
        ctx.arc(x + shadowOffset, y + 2 * shadowOffset, renderSize / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()

        this.renderTileImage(cornerX, cornerY, renderSize)

        if (this.isClicked) {
            ctx.fillStyle = "rgba(255,255,255,.3)"
            ctx.beginPath()
            ctx.arc(x, y, renderSize / 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
        } else if (this.isBeingDragged || this.isHovered) {
            ctx.fillStyle = "rgba(255,255,255,.15)"
            ctx.beginPath()
            ctx.arc(x, y, renderSize / 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
        }
    }

    renderTileImage(x: number, y: number, size: number) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(this.imageElement, x, y, size, size)
    }

    requiresDefer = () => this.isBeingDragged || this.isClicked

    get isDark() {
        return this._isDark
    }

    set isDark(value) {
        this._isDark = value
        this.imageElement = document.getElementById(value ? this.imageResource + "__dark" : this.imageResource) as HTMLImageElement
    }

    setThrown() {
        this.isThrown = true
        this.isHovered = false
        this.isBeingDragged = false
        this.isClicked = false
        this.field = null
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

    atField(x: number, y: number): this {
        this.field = gameBoard.getField(x, y)!!
        this.field.tile = this
        return this
    }

    abstract canThrow(other: Tile): boolean
}

export class LotusTile extends Tile {
    constructor() {
        super("lotus");
    }

    canThrow(other: Tile): boolean {
        return false;
    }
}

export class AvatarTile extends Tile {
    constructor() {
        super("avatar");
    }

    canThrow(other: Tile): boolean {
        return true;
    }
}

export class AirTile extends Tile {
    constructor() {
        super("air");
    }

    canThrow(other: Tile): boolean {
        return other instanceof WaterTile;
    }
}

export class EarthTile extends Tile {
    constructor() {
        super("earth");
    }

    canThrow(other: Tile): boolean {
        return other instanceof FireTile;
    }
}

export class FireTile extends Tile {
    constructor() {
        super("fire");
    }

    canThrow(other: Tile): boolean {
        return other instanceof AirTile;
    }
}

export class WaterTile extends Tile {
    constructor() {
        super("water");
    }

    canThrow(other: Tile): boolean {
        return other instanceof EarthTile;
    }
}