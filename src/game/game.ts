import { renderCanvas } from "./render-core.js";
import { initLogic } from "./logic-core.js";
import { connectToServer } from "./client-core.js";
import { updateScale } from "../shared/utils/dimensions.js";
import { shift, zoomLevel } from "./logic/camera.js";

export const canvas = document.getElementById("main-canvas") as HTMLCanvasElement
export const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!!
export const isDebug: boolean = false

window.addEventListener("resize", setCanvasDimensions)
initLogic()
setCanvasDimensions()
connectToServer()

export function setCanvasDimensions() {
    updateScale(zoomLevel / 100)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    shift(0, 0)
    draw()
}

export function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    renderCanvas()
}
