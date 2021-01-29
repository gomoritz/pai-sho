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
        new LotusTile().atField(6 * n, 6 * n),

        new AirTile().atField(5 * n, 6 * n),
        new WaterTile().atField(4 * n, 6 * n),
        new EarthTile().atField(3 * n, 6 * n),
        new FireTile().atField(2 * n, 6 * n),
        new AirTile().atField(2 * n, 5 * n),
        new WaterTile().atField(1 * n, 7 * n),

        new EarthTile().atField(6 * n, 5 * n),
        new FireTile().atField(6 * n, 4 * n),
        new AirTile().atField(6 * n, 3 * n),
        new WaterTile().atField(6 * n, 2 * n),
        new EarthTile().atField(5 * n, 2 * n),
        new FireTile().atField(7 * n, 1 * n),

        new AvatarTile().atField(4 * n, 4 * n)
    ]

    if (isOpponent) {
        tiles.forEach(it => it.isDark = true)
        opponentTiles = tiles
    } else {
        myTiles = tiles
    }

    renderObjects.push(...tiles)
}