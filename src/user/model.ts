export interface IUser {
    _key: string
    name: string
    firebaseToken: string
    lastSeenAt: Date
    createdAt: Date
    deleted: boolean
    banned: boolean
}