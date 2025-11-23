using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class OfferQueryObject
    {
         public string? CreatedBy { get; set; }
        public List<int>? MakeIds { get; set; } = null;
        public List<int>? ModelIds { get; set; } = null;
        public string? SortBy { get; set; } = null;
        public bool SortDescending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}