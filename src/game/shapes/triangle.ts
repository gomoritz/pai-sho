import { ctx } from "../game.js";

export function drawTriangle(pos1: Point, pos2: Point, pos3: Point, color: string) {
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.lineTo(pos3.x, pos3.y);
    ctx.fill();
}