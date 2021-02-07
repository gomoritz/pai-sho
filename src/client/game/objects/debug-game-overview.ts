import RenderObject from "./render-object.js";
import { ctx, isDebug } from "../game.js";
import { GameStartPacket } from "../../../shared/events/game-start.js";
import { movingTile } from "../logic/tile-interaction.js";
import { add } from "../../../shared/utils/point.js";
import { gameBoardRenderer } from "../render-core.js";

export default class DebugGameOverview extends RenderObject {
    private static instance: DebugGameOverview

    constructor(public state: GameStartPacket) {
        super();
        DebugGameOverview.instance = this
    }

    public static getInstance(): DebugGameOverview {
        return this.instance
    }

    render = (): void => {
        if (!isDebug) return

        ctx.font = "16px monospace"
        ctx.fillStyle = "#FFFFFFFF"

        const lines = [
            `Role: ${this.state.role.toUpperCase()}`,
            `My Turn: ${this.state.myTurn}`,
            `Player A: ${this.state.players.a}`,
            `Player B: ${this.state.players.b}`
        ]

        lines.forEach((line, index) => {
            ctx.fillText(line, 10, 25 + (20 * index))
        })

        if (movingTile != null) {
            movingTile.getFieldsForPossibleMoves().forEach(field => {
                const point = add(gameBoardRenderer.center, field.translateToPoint()!!)
                ctx.fillStyle = "#E10EBF"
                ctx.beginPath()
                ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
                ctx.fill()
            })

            movingTile.getTilesWhichCouldThrow().forEach(tile => {
                const point = add(gameBoardRenderer.center, tile.field!!.translateToPoint()!!)
                ctx.fillStyle = "#E1580E"
                ctx.beginPath()
                ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
                ctx.fill()
            })
        }
    }
}