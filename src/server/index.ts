import express from "express"
import { createServer } from "http"
import { attachSocketServer } from "./socket.js";
import { generateUUID, RoomManager } from "./room/room-manager.js";

const app = express()
const http = createServer(app)
const port = 1616

app.use("/game", express.static("src/client/game", { index: "game.html" }))
app.use("/play", express.static("src/client/play", { index: "play.html" }))
app.use("/room", express.static("src/client/room", { index: "room.html" }))
app.use("/resources", express.static("resources"))
app.use("/shared", express.static("src/shared"))

app.get("/create_room", (req, res) => res.redirect(`/room?id=${RoomManager.createPrivateRoom(generateUUID()).id}`))
app.get("/queue", (req, res) => res.redirect(`/room?id=${RoomManager.queue().id}`))
app.get("/", (req, res) => res.redirect("/play"))

attachSocketServer(http)

http.listen(port, () => console.info(`Backend started on port ${port}`))