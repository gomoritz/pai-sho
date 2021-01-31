import RenderObject from "./render-object.js";
import { GameStartEvent } from "../../shared/events/game-events.js";
import { ctx } from "../game.js";

export default class DebugGameOverview extends RenderObject {
    private static instance: DebugGameOverview

    public static getInstance(): DebugGameOverview {
        return this.instance
    }

    constructor(public state: GameStartEvent) {
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