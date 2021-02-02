import RenderObject from "./render-object.js";
import { gameBoard } from "../logic-core.js";
import { canMoveTileToField } from "../../shared/logic/tile-moves.js";
import { add } from "../../shared/utils/point.js";
import { gameBoardRenderer } from "../render-core.js";
import { ctx } from "../game.js";
import { closestHintField, movingTile } from "../logic/tile-interaction.js";
import { verify } from "../logic/whose-turn-is-it.js";
import { hintSize } from "../../shared/utils/dimensions.js";

export class HintRenderer extends RenderObject {
    render = () => {
        if (movingTile == null) return;

        Object.values(gameBoard.fields)
            .filter(it => canMoveTileToField(movingTile!!, it) && verify(movingTile!!, it))
            .forEach(field => {
                const pos = add(field.translateToPoint()!!, gameBoardRenderer.center)

                ctx.save()
                ctx.globalAlpha = .4
                movingTile!!.renderer.renderTileImage(pos.x - hintSize / 2, pos.y - hintSize / 2, hintSize)
                ctx.restore()

                if (field.x == closestHintField?.x && field.y == closestHintField.y) {
                    ctx.beginPath()
                    ctx.arc(pos.x, pos.y, hintSize / 2, 0, Math.PI * 2)
                    ctx.fillStyle = "rgba(0,0,0,.3)"
                    ctx.fill()
                    ctx.closePath()
                }
            })
    }
}