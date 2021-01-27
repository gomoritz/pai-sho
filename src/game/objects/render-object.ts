export default abstract class RenderObject {
    abstract render: () => void

    requiresDefer: () => boolean = () => {
        return false
    }
}