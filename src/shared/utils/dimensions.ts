import * as abstract from "./abstract-dimensions.js"

export let scale: number;

export let gameBoardRadius: number
export let innerTrianglesHeight: number
export let lineGap: number
export let lineStroke: number

export let shadowGradientInnerRadius: number
export let shadowGradientOuterRadius: number
export let shadowOffsetX: number
export let shadowOffsetY: number

export let outerBorder: number
export let innerBorder: number

export let tileSize: number
export let hintSize: number
export let selectedSize: number

export function updateScale(value: number) {
    scale = value

    gameBoardRadius = abstract.gameBoardRadius * scale
    innerTrianglesHeight = abstract.innerTrianglesHeight * scale
    lineGap = innerTrianglesHeight * 2 / 7
    lineStroke = 3 * scale

    shadowGradientInnerRadius = gameBoardRadius - (20 * scale)
    shadowGradientOuterRadius = gameBoardRadius + (50 * scale)
    shadowOffsetX = 3 * scale
    shadowOffsetY = 5 * scale

    outerBorder = gameBoardRadius + (22 * scale)
    innerBorder = gameBoardRadius + (9 * scale)

    tileSize = abstract.tileSize * scale
    hintSize = tileSize * 0.95
    selectedSize = tileSize * 1.07
}

updateScale(1)