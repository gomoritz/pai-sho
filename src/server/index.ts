import express from "express"
import { createServer } from "http"
import { attachSocketServer } from "./socket.js";

const app = express()
const http = createServer(app)
const port = 3000

app.use("/game", express.static("src/game", { index: "game.html" }))
app.use("/resources", express.static("resources"))

attachSocketServer(http)

http.listen(port, () => console.info(`Backend started on port ${port}`))