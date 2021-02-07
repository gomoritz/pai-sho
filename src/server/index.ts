import express from "express"
import { createServer } from "http"
import { attachSocketServer } from "./socket.js";

const app = express()
const http = createServer(app)
const port = 1616

app.use("/game", express.static("src/client/game", { index: "game.html" }))
app.use("/play", express.static("src/client/play", { index: "play.html" }))
app.use("/resources", express.static("resources"))
app.use("/shared", express.static("src/shared"))

attachSocketServer(http)

http.listen(port, () => console.info(`Backend started on port ${port}`))