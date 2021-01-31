const element = document.getElementById("overlay")!!;
const textElement = document.getElementById("overlay-text")!!

export function hideOverlay() {
    element.style.opacity = "0"
    setTimeout(() => {
        element.style.display = "none"
    }, 500)
}

export function showOverlay(text?: string) {
    if (text) textElement.innerText = text
    element.style.display = "flex"
    element.style.opacity = "1"
}