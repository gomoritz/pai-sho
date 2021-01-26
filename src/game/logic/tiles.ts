import RenderObject from "../objects/render-object.js";
import { ctx } from "../game.js";
import { gameBoardRenderer } from "../render-core.js";
import { add } from "../shapes/point.js";
import Field from "./field.js";

export abstract class Tile implements RenderObject {
    public isDark: boolean
    public field: Field | null = null

    protected abstract imageResource: string

    render(): void {
        if (this.field == undefined) return

        const center = gameBoardRenderer.center
        const id = this.isDark ? this.imageResource + "__dark" : this.imageResource
        const image = document.getElementById(id) as HTMLImageElement
        const size = 44
        const { x, y } = add(center, this.field.translateToPoint()!!)

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(image, x - size / 2, y - size / 2, size, size)
    }
}

export class LotusTile extends Tile {
    imageResource: string = "lotus";
}

export class AvatarTile extends Tile {
    imageResource: string = "avatar"
}

export class AirTile extends Tile {
    imageResource: string = "air"
}

export class EarthTile extends Tile {
    imageResource: string = "earth"
}

export class FireTile extends Tile {
    imageResource: string = "fire"
}

export class WaterTile extends Tile {
    imageResource: string = "water"
}