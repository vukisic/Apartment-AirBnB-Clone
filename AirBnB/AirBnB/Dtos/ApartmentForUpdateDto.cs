using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class ApartmentForUpdateDto
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int Rooms { get; set; }
        public int Guests { get; set; }
        public string Dates { get; set; }
        public bool DatesUpdate { get; set; }
        public DateTime TimeIn { get; set; }
        public DateTime TimeOut { get; set; }
        public double Price { get; set; }
        public ICollection<AmenitieDto> Amenities { get; set; }
    }
}
