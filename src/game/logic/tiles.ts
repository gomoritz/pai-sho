import RenderObject from "../objects/render-object.js";
import { ctx } from "../game.js";
import { gameBoardRenderer } from "../render-core.js";
import Point, { add, subtract } from "../shapes/point.js";
import Field from "./field.js";
import { gameBoard } from "../logic-core.js";

const size = 42

export abstract class Tile extends RenderObject {
    public isDark: boolean
    public field: Field | null = null

    public isHovered: boolean = false
    public isBeingDragged: boolean = false
    public isClicked: boolean = false;
    public dragPosition: Point | null = null

    protected abstract imageResource: string

    render = () => {
        if (this.field == undefined) return

        const center = gameBoardRenderer.center
        const id = this.isDark ? this.imageResource + "__dark" : this.imageResource
        const image = document.getElementById(id) as HTMLImageElement
        let { x, y } = add(center, this.field.translateToPoint()!!)

        if (this.isBeingDragged && this.dragPosition != null) {
            x = this.dragPosition.x
            y = this.dragPosition.y
        }

        const cornerX = x - size / 2
        const cornerY = y - size / 2

        ctx.fillStyle = "rgba(0,0,0,.7)"
        ctx.beginPath()
        ctx.arc(x + 1, y + 2, size / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(image, cornerX, cornerY, size, size)

        if (this.isClicked) {
            ctx.fillStyle = "rgba(255,255,255,.3)"
            ctx.beginPath()
            ctx.arc(x, y, size / 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
        } else if (this.isBeingDragged || this.isHovered) {
            ctx.fillStyle = "rgba(255,255,255,.15)"
            ctx.beginPath()
            ctx.arc(x, y, size / 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
        }
    }

    requiresDefer = () => this.isBeingDragged || this.isClicked

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
        this.field = gameBoard.getField(x,  y)
        return this
    }

    abstract canThrow(other: Tile): boolean
}

export class LotusTile extends Tile {
    imageResource: string = "lotus";

    canThrow(other: Tile): boolean {
        return false;
    }
}

export class AvatarTile extends Tile {
    imageResource: string = "avatar"

    canThrow(other: Tile): boolean {
        return true;
    }
}

export class AirTile extends Tile {
    imageResource: string = "air"

    canThrow(other: Tile): boolean {
        return other instanceof WaterTile;
    }
}

export class EarthTile extends Tile {
    imageResource: string = "earth"

    canThrow(other: Tile): boolean {
        return other instanceof FireTile;
    }
}

export class FireTile extends Tile {
    imageResource: string = "fire"

    canThrow(other: Tile): boolean {
        return other instanceof AirTile;
    }
}

export class WaterTile extends Tile {
    imageResource: string = "water"

    canThrow(other: Tile): boolean {
        return other instanceof EarthTile;
    }
}