namespace api.Dtos.MakesAndModels.ToDeserializeJson
{
    public class MakeData
    {
        public int make_id { get; set; }
        public string make_name { get; set; } = null!;
        public string make_slug { get; set; } = null!;
        public Dictionary<string, ModelData> models { get; set; } = new();
    }
}