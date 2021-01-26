import { renderCanvas } from "./render-core.js";

export const canvas = document.getElementById("main-canvas") as HTMLCanvasElement
export const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!!

window.addEventListener("resize", async () => await setCanvasDimensions())
setCanvasDimensions()
draw()

function setCanvasDimensions() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    console.log("== Updated canvas dimensions ==")
    console.log("canvas.width =", canvas.width)
    console.log("canvas.height =", canvas.height)

    draw()
}

function draw() {
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    renderCanvas()
}
