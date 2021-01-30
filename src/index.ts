import express from "express"

const app = express()
const port = 3000

app.use("/game", express.static("src/game", { index: "game.html" }))
app.use("/resources", express.static("resources"))

app.listen(port, () => console.info(`Successfully started on port ${port}`))