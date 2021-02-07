const privateRoomElement = document.querySelector(".private button")!!
privateRoomElement.addEventListener("click", () => {
    window.location.pathname = "/create_room"
})