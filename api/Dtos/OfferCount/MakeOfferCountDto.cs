using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.OfferCount
{
    public class MakeOfferCountDto
    {
        public int MakeId { get; set; }
        public string MakeName { get; set; } = string.Empty;
        public string MakeSlug { get; set; } = string.Empty;
        public int OfferCount { get; set; }
    }
}