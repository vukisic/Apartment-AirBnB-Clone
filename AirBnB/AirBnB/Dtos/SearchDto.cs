using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class SearchDto
    {
        public string City { get; set; }
        public string Country { get; set; }
        public string Dates { get; set; }
        public int Guest { get; set; }
        public int Room { get; set; }
        public double MaxPrice { get; set; }
        public double MinPrice { get; set; }
    }
}
