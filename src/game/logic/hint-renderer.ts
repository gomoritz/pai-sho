import RenderObject from "../objects/render-object.js";
import { gameBoard } from "../logic-core.js";
import { canMoveTileToField } from "../../shared/logic/tile-moves.js";
import { add } from "../../shared/utils/point.js";
import { gameBoardRenderer } from "../render-core.js";
import { ctx } from "../game.js";
import { closestHintField, movingTile } from "./tile-interaction.js";

export class HintRenderer extends RenderObject {
    render = () => {
        if (movingTile == null) return;

        Object.values(gameBoard.fields)
            .filter(it => canMoveTileToField(movingTile!!, it))
            .forEach(field => {
                const pos = add(field.translateToPoint()!!, gameBoardRenderer.center)

                ctx.save()
                ctx.globalAlpha = .4
                movingTile!!.renderer.renderTileImage(pos.x - 20, pos.y - 20, 40)
                ctx.restore()

                if (field.x == closestHintField?.x && field.y == closestHintField.y) {
                    ctx.beginPath()
                    ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
                    ctx.fillStyle = "rgba(0,0,0,.3)"
                    ctx.fill()
                    ctx.closePath()
                }
            })
    }
}