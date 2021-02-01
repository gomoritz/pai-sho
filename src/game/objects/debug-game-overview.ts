import RenderObject from "./render-object.js";
import { ctx } from "../game.js";
import { GameStartPacket } from "../../shared/events/game-start.js";

export default class DebugGameOverview extends RenderObject {
    private static instance: DebugGameOverview

    public static getInstance(): DebugGameOverview {
        return this.instance
    }

    constructor(public state: GameStartPacket) {
        super();
        DebugGameOverview.instance = this
    }

    render = (): void => {
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
    }
}