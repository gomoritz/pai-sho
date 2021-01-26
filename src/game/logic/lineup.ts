import { AirTile, AvatarTile, EarthTile, FireTile, LotusTile, Tile, WaterTile } from "./tiles.js";
import { renderObjects } from "../render-core.js";

export function activateLineup(isOpponent: boolean) {
    const n = isOpponent ? -1 : 1
    const all: Tile[] = [
        new LotusTile().atField(-6 * n, -6 * n),

        new AirTile().atField(-5 * n, -6 * n),
        new WaterTile().atField(-4 * n, -6 * n),
        new EarthTile().atField(-3 * n, -6 * n),
        new FireTile().atField(-2 * n, -6 * n),
        new AirTile().atField(-2 * n, -5 * n),
        new WaterTile().atField(-1 * n, -7 * n),

        new EarthTile().atField(-6 * n, -5 * n),
        new FireTile().atField(-6 * n, -4 * n),
        new AirTile().atField(-6 * n, -3 * n),
        new WaterTile().atField(-6 * n, -2 * n),
        new EarthTile().atField(-5 * n, -2 * n),
        new FireTile().atField(-7 * n, -1 * n),

        new AvatarTile().atField(-4 * n, -4 * n)
    ]

    if (isOpponent) all.forEach(it => it.isDark = true)

    renderObjects.push(...all)
}