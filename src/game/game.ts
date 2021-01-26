import { renderCanvas } from "./render-core.js";
import { initLogic } from "./logic-core.js";

export const canvas = document.getElementById("main-canvas") as HTMLCanvasElement
export const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!!
export const isDebug: boolean = true

window.addEventListener("resize", async () => await setCanvasDimensions())
initLogic()
setCanvasDimensions()

function setCanvasDimensions() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    draw()
}

function draw() {
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    renderCanvas()
}
