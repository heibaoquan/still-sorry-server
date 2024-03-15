export type Offense = "Spam" | "Harassment" | "Hard-Trolling"

export interface IReport {
    _key: string
    _from: string
    _to: string
    offense: Offense
}