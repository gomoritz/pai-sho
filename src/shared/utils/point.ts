export default interface Point {
    x: number
    y: number
}

export function add(a: Point, b: Point): Point {
    return { x: a.x + b.x, y: a.y + b.y }
}

export function subtract(a: Point, b: Point): Point {
    return { x: a.x - b.x, y: a.y - b.y }
}

export function multiply(a: Point, n: number): Point {
    return { x: a.x * n, y: a.y * n }
}

export function distanceBetween(a: Point, b: Point): number {
    const distanceX = Math.abs(b.x - a.x)
    const distanceY = Math.abs(b.y - a.y)
    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))
}