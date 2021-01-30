import { AirTile, AvatarTile, EarthTile, FireTile, LotusTile, Tile, WaterTile } from "./tiles.js";
import { renderObjects } from "../render-core.js";

export let myTiles: Tile[] = []
export let opponentTiles: Tile[] = []

export function buildLineup() {
    placeTilesFor("me")
    placeTilesFor("opponent")
}

function placeTilesFor(player: "me" | "opponent") {
    const isOpponent = player === "opponent"
    const n = isOpponent ? -1 : 1
    const tiles: Tile[] = [
        new LotusTile("lotus").atField(6 * n, 6 * n),

        new AirTile("air-1").atField(5 * n, 6 * n),
        new WaterTile("water-1").atField(4 * n, 6 * n),
        new EarthTile("earth-1").atField(3 * n, 6 * n),
        new FireTile("fire-1").atField(2 * n, 6 * n),
        new AirTile("air-2").atField(2 * n, 5 * n),
        new WaterTile("water-2").atField(1 * n, 7 * n),

        new EarthTile("earth-2").atField(6 * n, 5 * n),
        new FireTile("fire-2").atField(6 * n, 4 * n),
        new AirTile("air-3").atField(6 * n, 3 * n),
        new WaterTile("water-3").atField(6 * n, 2 * n),
        new EarthTile("earth-3").atField(5 * n, 2 * n),
        new FireTile("fire-3").atField(7 * n, 1 * n),

        new AvatarTile("avatar").atField(4 * n, 4 * n)
    ]

    if (isOpponent) {
        tiles.forEach(it => it.isDark = true)
        opponentTiles = tiles
    } else {
        myTiles = tiles
    }

    renderObjects.push(...tiles)
}