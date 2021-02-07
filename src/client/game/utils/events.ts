export function cancelEvent(event: Event) {
    event.preventDefault()
    event.stopPropagation()
}