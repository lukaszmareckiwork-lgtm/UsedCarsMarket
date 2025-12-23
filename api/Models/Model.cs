using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("Models")]
    public class Model
    {
        public int ModelId { get; set; }
        public string ModelName { get; set; } = null!;
        public string VehicleType { get; set; } = null!;

        public int MakeId { get; set; }
        public Make Make { get; set; } = null!;
        
        public List<ModelYear> Years { get; set; } = new();
    }
}