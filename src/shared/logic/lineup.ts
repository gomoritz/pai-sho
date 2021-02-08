import { AirTile, AvatarTile, EarthTile, FireTile, LotusTile, Tile, WaterTile } from "./tiles.js";
import GameBoard from "./game-board.js";
import { RespawnAvatarPacket } from "../events/respawn-avatar.js";

export default class Lineup {

    constructor(private gameBoard: GameBoard) {
    }

    myTiles: Tile[] = []
    opponentTiles: Tile[] = []

    myAvatar: AvatarTile
    opponentAvatar: AvatarTile

    buildLineup(): Tile[] {
        this.placeTilesFor("me")
        this.placeTilesFor("opponent")
        return this.myTiles.concat(this.opponentTiles)
    }

    respawnAvatar(packet: RespawnAvatarPacket) {
        if (packet.myAvatar) {
            this.myAvatar.isThrown = false
            this.myAvatar.atField(this.gameBoard, 4, 4)
            this.myTiles.push(this.myAvatar)
        } else {
            this.opponentAvatar.isThrown = false
            this.opponentAvatar.atField(this.gameBoard, -4, -4)
            this.opponentTiles.push(this.opponentAvatar)
        }
    }

    placeTilesFor(player: "me" | "opponent") {
        const gameBoard = this.gameBoard
        const isOpponent = player === "opponent"
        const n = isOpponent ? -1 : 1
        const avatar = new AvatarTile("avatar", isOpponent).atField(gameBoard, 4 * n, 4 * n);

        const tiles: Tile[] = [
            new LotusTile("lotus", isOpponent).atField(gameBoard, 6 * n, 6 * n),

            new AirTile("air-1", isOpponent).atField(gameBoard, 5 * n, 6 * n),
            new WaterTile("water-1", isOpponent).atField(gameBoard, 4 * n, 6 * n),
            new EarthTile("earth-1", isOpponent).atField(gameBoard, 3 * n, 6 * n),
            new FireTile("fire-1", isOpponent).atField(gameBoard, 2 * n, 6 * n),
            new AirTile("air-2", isOpponent).atField(gameBoard, 2 * n, 5 * n),
            new WaterTile("water-2", isOpponent).atField(gameBoard, 1 * n, 7 * n),

            new EarthTile("earth-2", isOpponent).atField(gameBoard, 6 * n, 5 * n),
            new FireTile("fire-2", isOpponent).atField(gameBoard, 6 * n, 4 * n),
            new AirTile("air-3", isOpponent).atField(gameBoard, 6 * n, 3 * n),
            new WaterTile("water-3", isOpponent).atField(gameBoard, 6 * n, 2 * n),
            new EarthTile("earth-3", isOpponent).atField(gameBoard, 5 * n, 2 * n),
            new FireTile("fire-3", isOpponent).atField(gameBoard, 7 * n, 1 * n),

            avatar
        ]

        if (isOpponent) {
            this.opponentTiles = tiles
            this.opponentAvatar = avatar
        } else {
            this.myTiles = tiles
            this.myAvatar = avatar
        }
    }
}