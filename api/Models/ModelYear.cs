using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("ModelYears")]
    public class ModelYear
    {
        public int ModelYearId { get; set; }
        public int Year { get; set; }
        public int ModelId { get; set; }
        public Model Model { get; set; } = null!;
    }
}