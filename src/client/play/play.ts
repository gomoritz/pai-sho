const privateRoomElement = document.querySelector(".private button")!!
const queueElement = document.querySelector(".queue button")!!

privateRoomElement.addEventListener("click", () => {
    window.location.pathname = "/create_room"
})

queueElement.addEventListener("click", () => {
    window.location.pathname = "/queue"
})