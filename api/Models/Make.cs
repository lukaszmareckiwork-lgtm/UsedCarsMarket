using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("Makes")]
    public class Make
    {
        public int MakeId { get; set; }
        public string MakeName { get; set; } = null!;
        public string MakeSlug { get; set; } = null!;
        
        public List<Model> Models { get; set; } = new();
    }
}