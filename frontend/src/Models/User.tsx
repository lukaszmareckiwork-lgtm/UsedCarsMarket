export type UserProfileToken = {
    userName: string,// "N"ame - required by db
    email: string,
    token: string
}

export type UserProfile = {
    username: string,
    email: string,
}