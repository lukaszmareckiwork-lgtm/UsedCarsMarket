export interface GetModelsResponseDto{
    makeId: number;
    models: ModelWithOffersDto[];
}

export interface ModelWithOffersDto{
    modelId: number;
    modelName: string;
    offersCount: number;
}