export default class Animation {
    public current: number = this.from
    private interval: any
    private readonly callbacks: ((value: number) => void)[] = []
    private readonly isNegative: boolean

    constructor(private readonly from: number, private readonly to: number,
                private readonly distancePerTick: number, private readonly tickDuration: number) {
        this.isNegative = to < from
        if (this.isNegative && this.distancePerTick > 0) {
            this.distancePerTick *= -1
        }
    }

    public start(): this {
        this.interval = setInterval(() => {
            this.current += this.distancePerTick
            if (this.isNegative ? this.current <= this.to : this.current >= this.to) {
                this.current = this.to
                this.callbacks.forEach(fun => fun(this.current))
                this.stop()
            } else {
                this.callbacks.forEach(fun => fun(this.current))
            }
        }, this.tickDuration)
        return this
    }

    public stop(): number {
        clearInterval(this.interval)
        return this.current
    }

    public withCallback(callback: (value: number) => void): this {
        this.callbacks.push(callback)
        return this
    }
}