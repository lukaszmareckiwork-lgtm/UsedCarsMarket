using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.OfferCount
{
    public class ModelOfferCountDto
    {
        public int MakeId { get; set; }
        public int ModelId { get; set; }
        public string ModelName { get; set; } = string.Empty;
        public int OfferCount { get; set; }
    }
}