export interface PhotoDto {
    id: number,
    urlSmall: string,
    urlMedium: string,
    urlLarge: string,
    sortOrder: number,
    createdDate: Date | string,
}