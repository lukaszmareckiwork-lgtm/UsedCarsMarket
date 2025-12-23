namespace api.Dtos.MakesAndModels.ToDeserializeJson
{
    public class ModelData
    {
        public int model_id { get; set; }
        public string model_name { get; set; } = null!;
        public string vehicle_type { get; set; } = null!;
        public List<int> years { get; set; } = new();
    }
}