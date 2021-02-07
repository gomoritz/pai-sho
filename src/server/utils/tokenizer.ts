import jwt from "jsonwebtoken"

const secret = "M8ra?8F=MqpKmNDXMCLC*DT8eeu!uQb$pDM2$6FWMay*4uHgk$SU!u^NYJ3HF*CnBj#UAep=fwmUCGS?4ANk+$D3%e_LsNgrhx4^"

export type GameKey = { roomId: string, username: string };

export function serializeGameKey(gameKey: GameKey): string {
    return jwt.sign(gameKey, secret)
}

export function deserializeGameKey(token: string): GameKey | null {
    try {
        return jwt.verify(token, secret) as GameKey
    } catch (e) {
        return null
    }
}