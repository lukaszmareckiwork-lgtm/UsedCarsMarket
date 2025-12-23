
namespace api.Dtos.MakesAndModels
{
    public class MakeWithOffersDto
    {
        public int MakeId { get; set; }
        public string MakeName { get; set; } = null!;
        public string MakeSlug { get; set; } = null!;
        public int OffersCount { get; set; }
    }

    public class ModelWithOffersDto
    {
        public int ModelId { get; set; }
        public string ModelName { get; set; } = null!;
        public int OffersCount { get; set; }
    }

    public class MakeModelsWithOffersDto
    {
        public int MakeId { get; set; }
        public List<ModelWithOffersDto> Models { get; set; } = new();
    }
}