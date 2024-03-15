export type Emotion = "Guilty" | "Remorseful" | "Regretful" | "Wistful" | "Ashamed"

export interface IHeartache {
    _key: string
    _from: string
    _to: string
    emotion: Emotion
    duration: number
    createdAt: Date
}